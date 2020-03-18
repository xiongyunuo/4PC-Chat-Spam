let keys = ["text", "function", "number"];
let values = [];
let textID = "text-field";
let text2ID = "text-field2";
let areaID = "textarea";
let errorID = "error";
let spamID = "spam";
let message = "Spam";
let func = new Function("str", "n", "o_str", "return str;");
let errorField = null;

const parseFun = function() {
  try {
    let func2 = new Function("str", "n", "o_str", values[1]);
    if (values[1] && func2) {
      func = func2;
    }
  }
  catch (_) {
    if (errorField) {
      errorField.innerText = "Illegal Function";
    }
    return;
  }
  if (errorField) {
    errorField.innerText = "";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  let textfield = document.getElementById(textID);
  let textfield2 = document.getElementById(text2ID);
  let textarea = document.getElementById(areaID);
  let button = document.getElementById(spamID);
  errorField = document.getElementById(errorID);
  for (let i = 0; i < keys.length; i++) {
    chrome.storage.sync.get(keys[i], items => {
      values.push(items[keys[i]]);
      if (i === keys.length - 1) {
        textfield.value = values[0];
        textarea.value = values[1];
        textfield2.value = values[2];
        parseFun();
        textfield.addEventListener("input", () => {
          values[0] = textfield.value;
          let items = {};
          items[keys[0]] = values[0];
          chrome.storage.sync.set(items, () => {});
        });
        textfield2.addEventListener("input", () => {
          let temp = Math.floor(Number(textfield2.value));
          if (temp !== NaN) {
            values[2] = temp;
            let items = {};
            items[keys[2]] = values[2];
            chrome.storage.sync.set(items, () => {});
          }
        });
        textarea.addEventListener("input", () => {
          values[1] = textarea.value;
          let items = {};
          items[keys[1]] = values[1];
          parseFun();
          chrome.storage.sync.set(items, () => {});
        });
        button.addEventListener("click", () => {
          chrome.runtime.sendMessage(message, () => { window.close(); });
        });
      }
    });
  }
});