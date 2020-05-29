RASA_API_URL = 'http://localhost:5005/webhooks/rest/webhook';
SENDER_ID = Math.random().toString(36).substring(7);

console.log(`Generated random sender id: ${SENDER_ID}`);

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

window.addEventListener('load', function () {
  const chatInput = document.getElementById('chatInput');
  const chatInputLenIndicator = document.getElementById('messageLenHint');

  chatInput.addEventListener('input', function (event) {
    chatInputLenIndicator.innerHTML = chatInput.value.length;
  });

  // Access the form element...
  const sendMessageForm = document.getElementById('sendMessageForm');

  // ...and take over its submit event.
  sendMessageForm.addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('here');
    onSubmitted(sendMessageForm);
    chatInputLenIndicator.innerHTML = 0;
  });
});

function onSubmitted(form) {
  message = form.elements['message'].value;
  sendMessage(message);
  form.reset();
}

function sendMessage(message, payload = '') {
  // Separate message/payload, as sometimes you want to send the server
  // a value that isn't the same as the message you want to display,
  // eg in the case of buttons.
  if (!payload) {
    // If not separate payload is defined, set the payload as the message.
    payload = message;
  }

  addSentMessage(message);

  data = {
    sender: SENDER_ID,
    message: payload,
  };

  postData(RASA_API_URL, data)
    .then((data) => {
      console.log(data);
      addReceivedMessages(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function addSentMessage(message) {
  // Get the sender message template and clone it
  var temp = document.getElementById('senderMessageTemplate');
  var clone = temp.content.cloneNode(true);
  clone.getElementById('chatboxSenderMessage').textContent = message;

  // Get the chatbox and append the message to it
  const chatBox = document.getElementById('chatbox');
  chatBox.appendChild(clone);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addReceivedMessages(data) {
  // Get the sender message/button templates and clone/append them
  const chatBox = document.getElementById('chatbox');

  const messageTemplate = document.getElementById('receiverMessageTemplate');

  const buttonTemplate = document.getElementById('responseButtonTemplate');

  data.forEach((message) => {
    messageClone = messageTemplate.content.cloneNode(true);
    messageClone.getElementById('chatboxReceiverMessage').textContent =
      message.text;
    chatBox.appendChild(messageClone);

    if (message.buttons) {
      message.buttons.forEach((button) => {
        buttonClone = buttonTemplate.content.cloneNode(true);
        buttonClone.getElementById('responseButton').textContent = button.title;
        buttonClone.getElementById('responseButton').onclick = function () { onClickSuggestionButton(button) };
        chatBox.appendChild(buttonClone);
      });
    }
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}


function onClickSuggestionButton(button) {
  sendMessage(button.title, button.payload);

  // Because there shouldn't be any after clicking a button, remove all the buttons from the chat 
  document.querySelectorAll('#responseButton').forEach(buttonNode => {
    buttonNode.remove()
  });
}
