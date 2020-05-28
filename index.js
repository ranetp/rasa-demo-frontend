window.addEventListener('load', function () {
  const chatInput = document.getElementById('chatInput');
  const chatInputLenIndicator = document.getElementById('messageLenHint');

  chatInput.addEventListener('input', function (event) {
    chatInputLenIndicator.innerHTML = chatInput.value.length;
  });

  function sendData(form) {
    const XHR = new XMLHttpRequest();
    // Set up our request
    XHR.open(
      'POST',
      'https://webhook.site/0aa678e0-be17-40e4-a6cf-6315cd015554'
    );
    XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Bind the FormData object and the form element
    const FD = new FormData(form);

    XHR.onload = function () {
      if (XHR.status === 200) {
        alert('Success');
      } else if (XHR.status !== 200) {
        alert('Request failed.  Returned status of ' + XHR.status);
      }
    };

    // The data sent is what the user provided in the form
    XHR.send(FD);
  }

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
  addSentMessage(message);
  // sendData(form);
  form.reset();
}

function addSentMessage(message) {
  // Get the sender message template and clone it
  var temp = document.getElementById('senderMessageTemplate');
  var clone = temp.content.cloneNode(true);
  clone.getElementById('chatboxSenderMessage').textContent = message;

  // Get the chatbox and append the message to it
  const chatBox = document.getElementById('chatbox');
  chatBox.appendChild(clone);
}

function addReceivedMessage(message) {
  // Get the sender message template and clone it
  var temp = document.getElementById('receiverMessageTemplate');
  var clone = temp.content.cloneNode(true);
  clone.getElementById('chatboxReceiverMessage').textContent = message;

  // Get the chatbox and append the message to it
  const chatBox = document.getElementById('chatbox');
  chatBox.appendChild(clone);
}
