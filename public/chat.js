const input = document.getElementById('message-input');
const messageBox = document.getElementById('messages');
const sendButton = document.querySelector('.chat-box button');
const groupListEl = document.getElementById('group-list');
const groupTitle = document.getElementById('current-group');
const LOCAL_STORAGE_KEY = 'chatMessages';
const MAX_MESSAGES = 10;

let socket;
let currentGroupId = localStorage.getItem('activeGroupId');

window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = '/login';

  socket = io('http://localhost:3001');

  if (currentGroupId) {
    joinGroup(currentGroupId);
  }

  loadGroups();
  setupEventListeners();
});

function getCurrentUsername() {
  const token = localStorage.getItem('token');
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.name;
}

// ------------------------ GROUP SIDEBAR ------------------------

function loadGroups() {
  const token = localStorage.getItem('token');

  fetch('http://localhost:3001/groups', {
    headers: { Authorization: 'Bearer ' + token }
  })
    .then(res => res.json())
    .then(data => {
      groupListEl.innerHTML = '';
      data.groups.forEach(group => {
        const li = document.createElement('li');
        li.textContent = group.name;
        li.onclick = () => joinGroup(group.id, group.name);
        groupListEl.appendChild(li);
      });
    });
}

function joinGroup(groupId, groupName) {
  if (currentGroupId) socket.emit('leave-group', currentGroupId);

  currentGroupId = groupId;
  localStorage.setItem('activeGroupId', groupId);

  if (groupName) groupTitle.textContent = groupName;

  socket.emit('join-group', groupId);

  fetchNewMessages(0); // Always load full latest 10 from backend
}

// ------------------------ MESSAGE HANDLING ------------------------

function loadMessagesFromLocalStorage() {
  try {
    const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
    return all[currentGroupId] || [];
  } catch (e) {
    return [];
  }
}

function saveMessagesToLocalStorage(messages) {
  const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
  const recentOnly = messages.slice(-MAX_MESSAGES);
  all[currentGroupId] = recentOnly;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
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

function fetchNewMessages(afterId = 0) {
  const token = localStorage.getItem('token');
  if (!currentGroupId) return;

  fetch(`http://localhost:3001/groups/${currentGroupId}/messages?after=${afterId}`, {
    headers: { Authorization: 'Bearer ' + token }
  })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) logout();
        throw new Error('Failed to fetch messages');
      }
      return res.json();
    })
    .then(data => {
      if (data && data.messages.length) {
        const combined = [...loadMessagesFromLocalStorage(), ...data.messages];
        const latest = combined.slice(-MAX_MESSAGES);
        saveMessagesToLocalStorage(latest);
        renderMessages(latest);
      }
    })
    .catch(err => {
      console.error('Fetch error:', err);
      messageBox.innerHTML = '<div class="message" style="color: red;">Failed to load messages. Please refresh.</div>';
    });
}

function sendMessage() {
  const msg = input.value.trim();
  if (!msg || !currentGroupId) return;

  const token = localStorage.getItem('token');
  const sender = getCurrentUsername();

  fetch(`http://localhost:3001/groups/${currentGroupId}/messages`, {
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
      const messageObj = { id: data.id, content: msg, sender, groupId: currentGroupId };
      socket.emit('send-message', messageObj);

      const updated = [...loadMessagesFromLocalStorage(), messageObj].slice(-MAX_MESSAGES);
      saveMessagesToLocalStorage(updated);
      renderMessages(updated);
    })
    .catch(err => console.error('Send error:', err));

  input.value = '';
  input.focus();
}

function setupEventListeners() {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });

  sendButton.addEventListener('click', () => sendMessage());

  socket.on('receive-message', msg => {
    if (msg.groupId !== currentGroupId) return;
    const updated = [...loadMessagesFromLocalStorage(), msg].slice(-MAX_MESSAGES);
    saveMessagesToLocalStorage(updated);
    renderMessages(updated);
  });
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  window.location.href = '/login';
}
