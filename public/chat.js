const input = document.getElementById('message-input');
const messageBox = document.getElementById('messages');
const sendButton = document.querySelector('.chat-box button');

const LOCAL_STORAGE_KEY = 'chatMessages';
const MAX_MESSAGES = 10;

window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  const socket = io('http://localhost:3001');
  const localMessages = loadMessagesFromLocalStorage();

  renderMessages(localMessages);

  fetchNewMessages(localMessages.at(-1)?.id || 0);

  setupEventListeners(socket);
});

function loadMessagesFromLocalStorage() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveMessagesToLocalStorage(messages) {
  let existing = loadMessagesFromLocalStorage();
  const combined = [...existing, ...messages];
  const recentOnly = combined.slice(-MAX_MESSAGES);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recentOnly));
}

function renderMessages(messages) {
  messageBox.innerHTML = '';
  const currentUser = getCurrentUsername();

  messages.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'message ' + (msg.sender === currentUser ? 'sent' : 'received');
    div.innerHTML = `
      <div class="sender">${msg.sender === currentUser ? 'You' : msg.sender}</div>
      <div class="content">${msg.content}</div>
    `;
    messageBox.appendChild(div);
  });

  messageBox.scrollTop = messageBox.scrollHeight;
}

function getCurrentUsername() {
  const token = localStorage.getItem('token');
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.name;
}

function fetchNewMessages(afterId = 0) {
  const token = localStorage.getItem('token');

  fetch(`http://localhost:3001/messages?after=${afterId}`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) {
          logout();
        }
        throw new Error('Failed to fetch messages');
      }
      return res.json();
    })
    .then(data => {
      if (data && data.messages.length) {
        saveMessagesToLocalStorage(data.messages);
        renderMessages(loadMessagesFromLocalStorage());
      }
    })
    .catch(err => {
      console.error('Error fetching messages:', err);
      messageBox.innerHTML = '<div class="message" style="color: red;">Failed to load messages. Please refresh.</div>';
    });
}

function sendMessage(socket) {
  const msg = input.value.trim();
  if (!msg) return;

  const token = localStorage.getItem('token');
  const sender = getCurrentUsername();

  fetch('http://localhost:3001/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ content: msg })
  })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) logout();
        throw new Error('Message not sent');
      }
      return res.json();
    })
    .then(data => {
      const messageObj = { id: data.id, content: msg, sender };
      socket.emit('send-message', messageObj);

      const updated = [...loadMessagesFromLocalStorage(), messageObj].slice(-MAX_MESSAGES);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      renderMessages(updated);
    })
    .catch(err => console.error('Send message error:', err));

  input.value = '';
  input.focus();
}

function setupEventListeners(socket) {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage(socket);
    }
  });

  sendButton.addEventListener('click', () => {
    sendMessage(socket);
  });

  socket.on('receive-message', msg => {
    const updated = [...loadMessagesFromLocalStorage(), msg].slice(-MAX_MESSAGES);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    renderMessages(updated);
  });
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  window.location.href = '/login';
}
