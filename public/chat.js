const input = document.getElementById('message-input');
const messageBox = document.getElementById('messages');

// 🔹 Pressing Enter sends the message
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault(); // avoid form submission or newline
    sendMessage();
  }
});

function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  const div = document.createElement('div');
  div.className = 'message';
  div.textContent = 'You: ' + msg;
  messageBox.appendChild(div);
  input.value = '';

  // 🔧 TODO: Send to backend/socket here
}

// Logout functionality
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
