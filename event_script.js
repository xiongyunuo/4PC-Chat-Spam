let keys = ["text", "function", "number"];
let defaults = ["I-I_I-I SUCK", "return str;", 10];
let message = "Spam";
let message2 = "Start Spam";
let currentId = 0;
let values = [];
let command = "spam chat";

for (let i = 0; i < keys.length; i++) {
  chrome.storage.sync.get(keys[i], items => {
    if (items[keys[i]] === undefined) {
      let items = {};
      items[keys[i]] = defaults[i];
      chrome.storage.sync.set(items, () => {});
    }
  });
}

const startSpam = function() {
  values = [];
  for (let i = 0; i < keys.length; i++) {
    chrome.storage.sync.get(keys[i], items => {
      values.push(items[keys[i]]);
      if (i == keys.length - 1) {
        chrome.tabs.query({currentWindow: true, active: true}, tabs => {
          currentId = tabs[0].id;
        });
        chrome.tabs.executeScript({
          file : "content_script.js"
        }, () => {
          chrome.tabs.sendMessage(currentId, {message: message2, text: values[0], func: values[1], number: values[2]}, () => {});
        });
      }
    });
  }
};

chrome.runtime.onMessage.addListener((msg, _, response) => {
  if (msg == message) {
    response();
    startSpam();
  }
});

chrome.commands.onCommand.addListener(cmd => {
  if (cmd == command) {
    startSpam();
  }
});