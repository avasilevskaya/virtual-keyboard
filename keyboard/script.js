const keyboard = {
    properties: {
        capsLock: false,
        lang: sessionStorage.getItem("lang") ? sessionStorage.getItem("lang") : "en"
    },

    createDOM() {
        this.wrapper = document.createElement("div");
        this.header = document.createElement("h1");
        this.description = document.createElement("p");
        this.instruction = document.createElement("p");
        this.textInput = document.createElement("textarea");
        this.keyboard = document.createElement("div");
        this.keysContainer = document.createElement("div");

        this.wrapper.classList.add("wrapper");
        this.textInput.classList.add("input");
        this.keyboard.classList.add("keyboard");
        this.keysContainer.classList.add("keyboard__keys");
        const headText = document.createTextNode("Виртуальная клавиатура");
        const descriptionText = document.createTextNode("Создана в Windows.");
        const instructionText = document.createTextNode("Для смены языка раскладки используйте левый Ctrl + левый Alt");  

        document.body.appendChild(this.wrapper);
        this.wrapper.appendChild(this.header);
        this.header.appendChild(headText);
        this.wrapper.appendChild(this.description);
        this.description.appendChild(descriptionText);
        this.wrapper.appendChild(this.instruction);
        this.instruction.appendChild(instructionText);
        this.wrapper.appendChild(this.textInput);
        this.wrapper.appendChild(this.keyboard);
        this.keyboard.appendChild(this.keysContainer);
        this.keysContainer.appendChild(this.createKeys());
        this.keys = this.keysContainer.querySelectorAll(".keyboard__key");
    },

    createKeys() {
        const keysFragment = document.createDocumentFragment();

        keyList.forEach(key => {
            let keyCode = key.keyCode;
            let keyObj = key[this.properties.lang];
            let keyValueNormal = keyObj.normal;

            const keyElement = document.createElement("button");

            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");
            keyElement.setAttribute('id', keyCode);
            keyElement.textContent = keyValueNormal;
            keyElement.addEventListener("click", () => {
              keyElement.classList.toggle("keyboard__key--animated");
              keyElement.addEventListener('animationend', () => {
                keyElement.classList.remove("keyboard__key--animated");
              });
            });

            switch (keyCode) {
                case "Backspace":
                    keyElement.style.width = '100px';
                    keyElement.addEventListener("click", () => {
                        let posStart = this.textInput.selectionStart;
                        let posEnd = this.textInput.selectionEnd;
                        if (posStart != posEnd) {
                            this.textInput.setRangeText("", posStart, posEnd, "end");
                        } else if (posStart > 0) {
                            this.textInput.setRangeText("", posStart-1, posEnd, "end");
                        }
                        this.textInput.focus();
                    });
                    break;
                
                case "Delete":
                    keyElement.style.width = '44px';
                    keyElement.addEventListener("click", () => {
                        let posStart = this.textInput.selectionStart;
                        let posEnd = this.textInput.selectionEnd;
                        if (posStart != posEnd) {
                            this.textInput.setRangeText("", posStart, posEnd, "end");
                        } else {
                            this.textInput.setRangeText("", posStart, posEnd+1, "end");
                        }
                        this.textInput.focus();
                    });
                    
                    break;

                case "CapsLock":
                    keyElement.style.width = '100px';
                    keyElement.addEventListener("click", () => {
                        this.toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--caps-active", this.properties.capsLock);
                    });
                    break;

                case "Enter":
                    keyElement.style.width = '86px';
                    keyElement.addEventListener("click", () => {
                        this.insertToInput("\n");
                    });
                    break;

                case "Tab":
                    keyElement.style.width = '50px';
                    keyElement.addEventListener("click", () => {
                        this.insertToInput("\t");
                    });
                    break;

                case "ShiftLeft":
                    keyElement.style.width = '100px';
                    break;
                
                case "ShiftRight":
                    keyElement.style.width = '86px';
                    break;

                case "Space":
                    keyElement.style.width = '330px';
                    keyElement.addEventListener("click", () => {
                        this.insertToInput(" ");
                    });
                    break;

                case "ControlLeft":
                case "ControlRight":
                case "MetaLeft":
                case "AltLeft":
                case "AltRight":
                case "ArrowLeft":
                case "ArrowRight":
                case "ArrowUp":
                case "ArrowDown":
                    break;
                
                default:
                    keyElement.textContent = keyValueNormal;
                    keyElement.addEventListener("click", () => {
                        this.insertToInput(keyCode);
                    });
                    break;
            }

            keysFragment.appendChild(keyElement);

            const insertLineBreak = ["Backspace", "Delete", "Enter", "ShiftRight"].indexOf(keyCode) !== -1;
            if (insertLineBreak) {
                keysFragment.appendChild(document.createElement("br"));
            }
        });

        return keysFragment;
    },

    toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

         for (const keyNode of this.keys) {
            let key = keyList.find(key => {return key.keyCode === keyNode.id})
            let keyObj = key[this.properties.lang];
            let keyValueNormal = keyObj.normal;
            let keyValueCaps = keyObj.caps;
            keyNode.textContent = this.properties.capsLock ? keyValueCaps : keyValueNormal;
        }
    },

    toggleLanguage() {
        if (this.properties.lang === 'en') {
            this.properties.lang = 'ru';
            sessionStorage.setItem("lang", "ru");
          } else {
            this.properties.lang = 'en';
            sessionStorage.setItem("lang", "en");
          }
          for (const keyNode of this.keys) {
            let key = keyList.find(key => {return key.keyCode === keyNode.id})
            let keyObj = key[this.properties.lang];
            let keyValueNormal = keyObj.normal;
            let keyValueCaps = keyObj.caps;
            keyNode.textContent = this.properties.capsLock ? keyValueCaps : keyValueNormal;
        }
    },

    insertToInput(keyCode) {
        let txt;
        let key = keyList.find(key => {return key.keyCode === keyCode})
        if (key) {
            let keyObj = key[this.properties.lang];
            let keyValueNormal = keyObj.normal;
            let keyValueCaps = keyObj.caps;
            txt = this.properties.capsLock ? keyValueCaps : keyValueNormal;
        } else {
            txt = keyCode
        };
        let pos = this.textInput.selectionStart;
        this.textInput.setRangeText(txt);
        this.textInput.selectionStart = pos + txt.length;
        this.textInput.selectionEnd = this.textInput.selectionStart;
        this.textInput.focus();
    }
    
};

document.addEventListener('keydown', function(event){
  const prevetDefault = [
    "Backspace", "Delete",
    "Tab", "Space", "Enter", 
    "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"
  ].indexOf(event.code) == -1;
  if (prevetDefault && document.getElementById(event.code)) {
    event.preventDefault();
  }
  let animatedKey = document.getElementById(event.code);
  if (animatedKey) {
    animatedKey.classList.toggle("keyboard__key--animated");
    animatedKey.addEventListener('animationend', () => {
      animatedKey.classList.remove("keyboard__key--animated");
    });
  }
  const insertKeyValue = [
    "Backspace", "Delete", "CapsLock", "Enter", 
    "Tab", "ShiftLeft", "ShiftRight", "Space",
    "ControlLeft", "ControlRight", "MetaLeft",
    "AltLeft", "AltRight", "ArrowLeft",
    "ArrowRight", "ArrowUp", "ArrowDown"
  ].indexOf(event.code) == -1;
  if (insertKeyValue && document.getElementById(event.code)) {
    keyboard.insertToInput(event.code);
  }
});

document.addEventListener('keyup', function(event){
  if (event.code === "ControlLeft") {
    if (event.altKey) {
      keyboard.toggleLanguage();
    }
  }
  if (event.code === "AltLeft") {
    if (event.ctrlKey) {
      keyboard.toggleLanguage();
    }
  }
  if (event.code === "CapsLock") {
      keyboard.toggleCapsLock();
      document.getElementById(event.code).classList.toggle("keyboard__key--caps-active", keyboard.properties.capsLock);
  }

});

window.addEventListener("DOMContentLoaded", function () {
    keyboard.createDOM();
});

const keyList = [
    {
      keyCode: 'Backquote',
      ru: {
        normal: 'ё',
        shift: 'Ё',
        caps: 'Ё',
        shiftCaps: 'ё',
      },
      en: {
        normal: '`',
        shift: '~',
        caps: '`',
        shiftCaps: '~',
      },
    },
    {
      keyCode: 'Digit1',
      ru: {
        normal: '1',
        shift: '!',
        caps: '1',
        shiftCaps: '!',
      },
      en: {
        normal: '1',
        shift: '!',
        caps: '1',
        shiftCaps: '!',
      },
    },
    {
      keyCode: 'Digit2',
      ru: {
        normal: '2',
        shift: '"',
        caps: '2',
        shiftCaps: '"',
      },
      en: {
        normal: '2',
        shift: '@',
        caps: '2',
        shiftCaps: '@',
      },
    },
    {
      keyCode: 'Digit3',
      ru: {
        normal: '3',
        shift: '№',
        caps: '3',
        shiftCaps: '№',
      },
      en: {
        normal: '3',
        shift: '#',
        caps: '3',
        shiftCaps: '#',
      },
    },
    {
      keyCode: 'Digit4',
      ru: {
        normal: '4',
        shift: ';',
        caps: '4',
        shiftCaps: ';',
      },
      en: {
        normal: '4',
        shift: '$',
        caps: '4',
        shiftCaps: '$',
      },
    },
    {
      keyCode: 'Digit5',
      ru: {
        normal: '5',
        shift: '%',
        caps: '5',
        shiftCaps: '%',
      },
      en: {
        normal: '5',
        shift: '%',
        caps: '5',
        shiftCaps: '%',
      },
    },
    {
      keyCode: 'Digit6',
      ru: {
        normal: '6',
        shift: ':',
        caps: '6',
        shiftCaps: ':',
      },
      en: {
        normal: '6',
        shift: '^',
        caps: '6',
        shiftCaps: '^',
      },
    },
    {
      keyCode: 'Digit7',
      ru: {
        normal: '7',
        shift: '?',
        caps: '7',
        shiftCaps: '?',
      },
      en: {
        normal: '7',
        shift: '&',
        caps: '7',
        shiftCaps: '&',
      },
    },
    {
      keyCode: 'Digit8',
      ru: {
        normal: '8',
        shift: '*',
        caps: '8',
        shiftCaps: '*',
      },
      en: {
        normal: '8',
        shift: '*',
        caps: '8',
        shiftCaps: '*',
      },
    },
    {
      keyCode: 'Digit9',
      ru: {
        normal: '9',
        shift: '(',
        caps: '9',
        shiftCaps: '(',
      },
      en: {
        normal: '9',
        shift: '(',
        caps: '9',
        shiftCaps: '(',
      },
    },
    {
      keyCode: 'Digit0',
      ru: {
        normal: '0',
        shift: ')',
        caps: '0',
        shiftCaps: ')',
      },
      en: {
        normal: '0',
        shift: ')',
        caps: '0',
        shiftCaps: ')',
      },
    },
    {
      keyCode: 'Minus',
      ru: {
        normal: '-',
        shift: '_',
        caps: '-',
        shiftCaps: '_',
      },
      en: {
        normal: '-',
        shift: '_',
        caps: '-',
        shiftCaps: '_',
      },
    },
    {
      keyCode: 'Equal',
      ru: {
        normal: '=',
        shift: '+',
        caps: '=',
        shiftCaps: '+',
      },
      en: {
        normal: '=',
        shift: '+',
        caps: '=',
        shiftCaps: '+',
      },
    },
    {
      keyCode: 'Backspace',
      ru: {
        normal: 'Backspace',
        shift: 'Backspace',
        caps: 'Backspace',
        shiftCaps: 'Backspace',
      },
      en: {
        normal: 'Backspace',
        shift: 'Backspace',
        caps: 'Backspace',
        shiftCaps: 'Backspace',
      },
    },
    {
      keyCode: 'Tab',
      ru: {
        normal: 'Tab',
        shift: 'Tab',
        caps: 'Tab',
        shiftCaps: 'Tab',
      },
      en: {
        normal: 'Tab',
        shift: 'Tab',
        caps: 'Tab',
        shiftCaps: 'Tab',
      },
    },
    {
      keyCode: 'KeyQ',
      ru: {
        normal: 'й',
        shift: 'Й',
        caps: 'Й',
        shiftCaps: 'й',
      },
      en: {
        normal: 'q',
        shift: 'Q',
        caps: 'Q',
        shiftCaps: 'q',
      },
    },
    {
      keyCode: 'KeyW',
      ru: {
        normal: 'ц',
        shift: 'Ц',
        caps: 'Ц',
        shiftCaps: 'ц',
      },
      en: {
        normal: 'w',
        shift: 'W',
        caps: 'W',
        shiftCaps: 'w',
      },
    },
    {
      keyCode: 'KeyE',
      ru: {
        normal: 'у',
        shift: 'У',
        caps: 'У',
        shiftCaps: 'у',
      },
      en: {
        normal: 'e',
        shift: 'E',
        caps: 'E',
        shiftCaps: 'e',
      },
    },
    {
      keyCode: 'KeyR',
      ru: {
        normal: 'к',
        shift: 'К',
        caps: 'К',
        shiftCaps: 'к',
      },
      en: {
        normal: 'r',
        shift: 'R',
        caps: 'R',
        shiftCaps: 'r',
      },
    },
    {
      keyCode: 'KeyT',
      ru: {
        normal: 'е',
        shift: 'Е',
        caps: 'Е',
        shiftCaps: 'е',
      },
      en: {
        normal: 't',
        shift: 'T',
        caps: 'T',
        shiftCaps: 't',
      },
    },
    {
      keyCode: 'KeyY',
      ru: {
        normal: 'н',
        shift: 'Н',
        caps: 'Н',
        shiftCaps: 'н',
      },
      en: {
        normal: 'y',
        shift: 'Y',
        caps: 'Y',
        shiftCaps: 'y',
      },
    },
    {
      keyCode: 'KeyU',
      ru: {
        normal: 'г',
        shift: 'Г',
        caps: 'Г',
        shiftCaps: 'г',
      },
      en: {
        normal: 'u',
        shift: 'U',
        caps: 'U',
        shiftCaps: 'u',
      },
    },
    {
      keyCode: 'KeyI',
      ru: {
        normal: 'ш',
        shift: 'Ш',
        caps: 'Ш',
        shiftCaps: 'ш',
      },
      en: {
        normal: 'i',
        shift: 'I',
        caps: 'I',
        shiftCaps: 'i',
      },
    },
    {
      keyCode: 'KeyO',
      ru: {
        normal: 'щ',
        shift: 'Щ',
        caps: 'Щ',
        shiftCaps: 'щ',
      },
      en: {
        normal: 'o',
        shift: 'O',
        caps: 'O',
        shiftCaps: 'o',
      },
    },
    {
      keyCode: 'KeyP',
      ru: {
        normal: 'з',
        shift: 'З',
        caps: 'З',
        shiftCaps: 'з',
      },
      en: {
        normal: 'p',
        shift: 'P',
        caps: 'P',
        shiftCaps: 'p',
      },
    },
    {
      keyCode: 'BracketLeft',
      ru: {
        normal: 'х',
        shift: 'Х',
        caps: 'Х',
        shiftCaps: 'х',
      },
      en: {
        normal: '[',
        shift: '{',
        caps: '[',
        shiftCaps: '{',
      },
    },
    {
      keyCode: 'BracketRight',
      ru: {
        normal: 'ъ',
        shift: 'Ъ',
        caps: 'Ъ',
        shiftCaps: 'ъ',
      },
      en: {
        normal: ']',
        shift: '}',
        caps: ']',
        shiftCaps: '}',
      },
    },
    {
      keyCode: 'Backslash',
      ru: {
        normal: '\\',
        shift: '/',
        caps: '\\',
        shiftCaps: '/',
      },
      en: {
        normal: '\\',
        shift: '|',
        caps: '\\',
        shiftCaps: '|',
      },
    },
    {
      keyCode: 'Delete',
      ru: {
        normal: 'Del',
        shift: 'Del',
        caps: 'Del',
        shiftCaps: 'Del',
      },
      en: {
        normal: 'Del',
        shift: 'Del',
        caps: 'Del',
        shiftCaps: 'Del',
      },
    },
    {
      keyCode: 'CapsLock',
      ru: {
        normal: 'CapsLock',
        shift: 'CapsLock',
        caps: 'CapsLock',
        shiftCaps: 'CapsLock',
      },
      en: {
        normal: 'CapsLock',
        shift: 'CapsLock',
        caps: 'CapsLock',
        shiftCaps: 'CapsLock',
      },
    },
    {
      keyCode: 'KeyA',
      ru: {
        normal: 'ф',
        shift: 'Ф',
        caps: 'Ф',
        shiftCaps: 'ф',
      },
      en: {
        normal: 'a',
        shift: 'A',
        caps: 'A',
        shiftCaps: 'a',
      },
    },
    {
      keyCode: 'KeyS',
      ru: {
        normal: 'ы',
        shift: 'Ы',
        caps: 'Ы',
        shiftCaps: 'ы',
      },
      en: {
        normal: 's',
        shift: 'S',
        caps: 'S',
        shiftCaps: 's',
      },
    },
    {
      keyCode: 'KeyD',
      ru: {
        normal: 'в',
        shift: 'В',
        caps: 'В',
        shiftCaps: 'в',
      },
      en: {
        normal: 'd',
        shift: 'D',
        caps: 'D',
        shiftCaps: 'd',
      },
    },
    {
      keyCode: 'KeyF',
      ru: {
        normal: 'а',
        shift: 'А',
        caps: 'А',
        shiftCaps: 'а',
      },
      en: {
        normal: 'f',
        shift: 'F',
        caps: 'F',
        shiftCaps: 'f',
      },
    },
    {
      keyCode: 'KeyG',
      ru: {
        normal: 'п',
        shift: 'П',
        caps: 'П',
        shiftCaps: 'п',
      },
      en: {
        normal: 'g',
        shift: 'G',
        caps: 'G',
        shiftCaps: 'g',
      },
    },
    {
      keyCode: 'KeyH',
      ru: {
        normal: 'р',
        shift: 'Р',
        caps: 'Р',
        shiftCaps: 'р',
      },
      en: {
        normal: 'h',
        shift: 'H',
        caps: 'H',
        shiftCaps: 'h',
      },
    },
    {
      keyCode: 'KeyJ',
      ru: {
        normal: 'о',
        shift: 'О',
        caps: 'О',
        shiftCaps: 'о',
      },
      en: {
        normal: 'j',
        shift: 'J',
        caps: 'J',
        shiftCaps: 'j',
      },
    },
    {
      keyCode: 'KeyK',
      ru: {
        normal: 'л',
        shift: 'Л',
        caps: 'Л',
        shiftCaps: 'л',
      },
      en: {
        normal: 'k',
        shift: 'K',
        caps: 'K',
        shiftCaps: 'k',
      },
    },
    {
      keyCode: 'KeyL',
      ru: {
        normal: 'д',
        shift: 'Д',
        caps: 'Д',
        shiftCaps: 'д',
      },
      en: {
        normal: 'l',
        shift: 'L',
        caps: 'L',
        shiftCaps: 'l',
      },
    },
    {
      keyCode: 'Semicolon',
      ru: {
        normal: 'ж',
        shift: 'Ж',
        caps: 'Ж',
        shiftCaps: 'ж',
      },
      en: {
        normal: ';',
        shift: ':',
        caps: ';',
        shiftCaps: ':',
      },
    },
    {
      keyCode: 'Quote',
      ru: {
        normal: 'э',
        shift: 'Э',
        caps: 'Э',
        shiftCaps: 'э',
      },
      en: {
        normal: '\'',
        shift: '"',
        caps: '\'',
        shiftCaps: '"',
      },
    },
    {
      keyCode: 'Enter',
      ru: {
        normal: 'Enter',
        shift: 'Enter',
        caps: 'Enter',
        shiftCaps: 'Enter',
      },
      en: {
        normal: 'Enter',
        shift: 'Enter',
        caps: 'Enter',
        shiftCaps: 'Enter',
      },
    },
    {
      keyCode: 'ShiftLeft',
      ru: {
        normal: 'Shift',
        shift: 'Shift',
        caps: 'Shift',
        shiftCaps: 'Shift',
      },
      en: {
        normal: 'Shift',
        shift: 'Shift',
        caps: 'Shift',
        shiftCaps: 'Shift',
      },
    },
    {
      keyCode: 'KeyZ',
      ru: {
        normal: 'я',
        shift: 'Я',
        caps: 'Я',
        shiftCaps: 'я',
      },
      en: {
        normal: 'z',
        shift: 'Z',
        caps: 'Z',
        shiftCaps: 'z',
      },
    },
    {
      keyCode: 'KeyX',
      ru: {
        normal: 'ч',
        shift: 'Ч',
        caps: 'Ч',
        shiftCaps: 'ч',
      },
      en: {
        normal: 'x',
        shift: 'X',
        caps: 'X',
        shiftCaps: 'x',
      },
    },
    {
      keyCode: 'KeyC',
      ru: {
        normal: 'с',
        shift: 'С',
        caps: 'С',
        shiftCaps: 'с',
      },
      en: {
        normal: 'c',
        shift: 'C',
        caps: 'C',
        shiftCaps: 'c',
      },
    },
    {
      keyCode: 'KeyV',
      ru: {
        normal: 'м',
        shift: 'М',
        caps: 'М',
        shiftCaps: 'м',
      },
      en: {
        normal: 'v',
        shift: 'V',
        caps: 'V',
        shiftCaps: 'v',
      },
    },
    {
      keyCode: 'KeyB',
      ru: {
        normal: 'и',
        shift: 'И',
        caps: 'И',
        shiftCaps: 'и',
      },
      en: {
        normal: 'b',
        shift: 'B',
        caps: 'B',
        shiftCaps: 'b',
      },
    },
    {
      keyCode: 'KeyN',
      ru: {
        normal: 'т',
        shift: 'Т',
        caps: 'Т',
        shiftCaps: 'т',
      },
      en: {
        normal: 'n',
        shift: 'N',
        caps: 'N',
        shiftCaps: 'n',
      },
    },
    {
      keyCode: 'KeyM',
      ru: {
        normal: 'ь',
        shift: 'Ь',
        caps: 'Ь',
        shiftCaps: 'ь',
      },
      en: {
        normal: 'm',
        shift: 'M',
        caps: 'M',
        shiftCaps: 'm',
      },
    },
    {
      keyCode: 'Comma',
      ru: {
        normal: 'б',
        shift: 'Б',
        caps: 'Б',
        shiftCaps: 'б',
      },
      en: {
        normal: ',',
        shift: '<',
        caps: ',',
        shiftCaps: '<',
      },
    },
    {
      keyCode: 'Period',
      ru: {
        normal: 'ю',
        shift: 'Ю',
        caps: 'Ю',
        shiftCaps: 'ю',
      },
      en: {
        normal: '.',
        shift: '>',
        caps: '.',
        shiftCaps: '>',
      },
    },
    {
      keyCode: 'Slash',
      ru: {
        normal: '.',
        shift: ',',
        caps: '.',
        shiftCaps: ',',
      },
      en: {
        normal: '/',
        shift: '?',
        caps: '/',
        shiftCaps: '?',
      },
    },
    {
      keyCode: 'ArrowUp',
      ru: {
        normal: '↑',
        shift: '↑',
        caps: '↑',
        shiftCaps: '↑',
      },
      en: {
        normal: '↑',
        shift: '↑',
        caps: '↑',
        shiftCaps: '↑',
      },
    },
    {
      keyCode: 'ShiftRight',
      ru: {
        normal: 'Shift',
        shift: 'Shift',
        caps: 'Shift',
        shiftCaps: 'Shift',
      },
      en: {
        normal: 'Shift',
        shift: 'Shift',
        caps: 'Shift',
        shiftCaps: 'Shift',
      },
    },
    {
      keyCode: 'ControlLeft',
      ru: {
        normal: 'Ctrl',
        shift: 'Ctrl',
        caps: 'Ctrl',
        shiftCaps: 'Ctrl',
      },
      en: {
        normal: 'Ctrl',
        shift: 'Ctrl',
        caps: 'Ctrl',
        shiftCaps: 'Ctrl',
      },
    },
    {
      keyCode: 'MetaLeft',
      ru: {
        normal: 'Win',
        shift: 'Win',
        caps: 'Win',
        shiftCaps: 'Win',
      },
      en: {
        normal: 'Win',
        shift: 'Win',
        caps: 'Win',
        shiftCaps: 'Win',
      },
    },
    {
      keyCode: 'AltLeft',
      ru: {
        normal: 'Alt',
        shift: 'Alt',
        caps: 'Alt',
        shiftCaps: 'Alt',
      },
      en: {
        normal: 'Alt',
        shift: 'Alt',
        caps: 'Alt',
        shiftCaps: 'Alt',
      },
    },
    {
      keyCode: 'Space',
      ru: {
        normal: ' ',
        shift: ' ',
        caps: ' ',
        shiftCaps: ' ',
      },
      en: {
        normal: ' ',
        shift: ' ',
        caps: ' ',
        shiftCaps: ' ',
      },
    },
    {
      keyCode: 'AltRight',
      ru: {
        normal: 'Alt',
        shift: 'Alt',
        caps: 'Alt',
        shiftCaps: 'Alt',
      },
      en: {
        normal: 'Alt',
        shift: 'Alt',
        caps: 'Alt',
        shiftCaps: 'Alt',
      },
    },
    {
      keyCode: 'ArrowLeft',
      ru: {
        normal: '←',
        shift: '←',
        caps: '←',
        shiftCaps: '←',
      },
      en: {
        normal: '←',
        shift: '←',
        caps: '←',
        shiftCaps: '←',
      },
    },
    {
      keyCode: 'ArrowDown',
      ru: {
        normal: '↓',
        shift: '↓',
        caps: '↓',
        shiftCaps: '↓',
      },
      en: {
        normal: '↓',
        shift: '↓',
        caps: '↓',
        shiftCaps: '↓',
      },
    },
    {
      keyCode: 'ArrowRight',
      ru: {
        normal: '→',
        shift: '→',
        caps: '→',
        shiftCaps: '→',
      },
      en: {
        normal: '→',
        shift: '→',
        caps: '→',
        shiftCaps: '→',
      },
    },
    {
      keyCode: 'ControlRight',
      ru: {
        normal: 'Ctrl',
        shift: 'Ctrl',
        caps: 'Ctrl',
        shiftCaps: 'Ctrl',
      },
      en: {
        normal: 'Ctrl',
        shift: 'Ctrl',
        caps: 'Ctrl',
        shiftCaps: 'Ctrl',
      },
    },
];
