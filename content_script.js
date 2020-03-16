let func = new Function("str", "return str;");
let message2 = "Start Spam";
let chatID = "chat-message-input";

const parseFun = function(str) {
  try {
    let func2 = new Function("str", str);
    if (str && func2) {
      func = func2;
    }
  }
  catch (_) {}
};

chrome.runtime.onMessage.addListener((msg, _, response) => {
  if (msg.message == message2) {
    response();
    parseFun(msg.func);
    let chat = document.getElementById(chatID);
    let text = msg.text;
    if (chat) {
      for (let i = 0; i < msg.number; i++) {
        chat.focus();
        chat.value = text;
        const event = new KeyboardEvent('keyup', {
          key: 'Enter',
        });
        chat.dispatchEvent(event);
        text = func(text);
      }
    }
  }
});