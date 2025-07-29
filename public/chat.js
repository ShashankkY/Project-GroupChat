const input = document.getElementById('message-input');
const messageBox = document.getElementById('messages');

window.addEventListener('DOMContentLoaded', fetchMessages);

function fetchMessages() {
  fetch('http://localhost:3000/messages')
    .then(res => res.json())
    .then(data => {
      const messageBox = document.getElementById('messages');
      messageBox.innerHTML = '';

      data.messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'message';
        div.textContent = `${msg.sender}: ${msg.content}`;
        messageBox.appendChild(div);
      });
    });
}

// 🔹 Pressing Enter sends the message
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault(); // avoid form submission or newline
    sendMessage();
  }
});

function sendMessage() {
  const input = document.getElementById('message-input');
  const msg = input.value.trim();
  if (!msg) return;

  const token = localStorage.getItem('token');

  fetch('http://localhost:3000/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ content: msg })
  }).then(response => {
    if (response.ok) {
      console.log('Message stored in DB');
    }
  });

  // UI append
  const messageBox = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'message';
  div.textContent = 'You: ' + msg;
  messageBox.appendChild(div);
  input.value = '';
}


// Logout functionality
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
