const input = document.getElementById('message-input');
const messageBox = document.getElementById('messages');
const sendButton = document.querySelector('.chat-box button');

// ✅ Check authentication first
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }
  
  // Connect to Socket.IO server
  const socket = io('http://localhost:3001');
  
  // Fetch all old messages on page load
  fetchMessages();
  
  // Setup event listeners
  setupEventListeners(socket);
});

function setupEventListeners(socket) {
  // Handle Enter key to send message
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage(socket);
    }
  });

  // Handle send button click
  sendButton.addEventListener('click', () => {
    sendMessage(socket);
  });

  // Listen for messages from other users
  socket.on('receive-message', msg => {
    const div = document.createElement('div');
    div.className = 'message received';
    
    // Handle different message formats
    let senderName = 'Unknown';
    let content = '';
    
    if (typeof msg === 'string') {
      content = msg;
    } else if (msg && msg.sender && msg.content) {
      senderName = msg.sender;
      content = msg.content;
    } else if (msg && msg.content) {
      content = msg.content;
    } else {
      content = 'Unknown message format';
    }
    
    div.innerHTML = `
      <div class="sender">${senderName}</div>
      <div class="content">${content}</div>
    `;
    
    messageBox.appendChild(div);
    messageBox.scrollTop = messageBox.scrollHeight;
  });
}

function fetchMessages() {
  const token = localStorage.getItem('token');
  
  fetch('http://localhost:3001/messages', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        throw new Error('Failed to fetch messages');
      }
      return res.json();
    })
    .then(data => {
      if (!data) return;
      
      messageBox.innerHTML = '';

      data.messages.forEach(msg => {
        const div = document.createElement('div');
        
        // Check if this message is from the current user
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const currentUserName = tokenData.name;
        
        if (msg.sender === currentUserName) {
          div.className = 'message sent';
          div.innerHTML = `
            <div class="sender">You</div>
            <div class="content">${msg.content}</div>
          `;
        } else {
          div.className = 'message received';
          div.innerHTML = `
            <div class="sender">${msg.sender}</div>
            <div class="content">${msg.content}</div>
          `;
        }
        
        messageBox.appendChild(div);
      });
      
      // Scroll to bottom after loading messages
      messageBox.scrollTop = messageBox.scrollHeight;
    })
    .catch(err => {
      console.error('Error fetching messages:', err);
      messageBox.innerHTML = '<div class="message" style="color: red;">Error loading messages. Please refresh the page.</div>';
    });
}

function sendMessage(socket) {
  const msg = input.value.trim();
  if (!msg) return;

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  // Get user info from token
  const tokenData = JSON.parse(atob(token.split('.')[1]));
  const senderName = tokenData.name;

  // ✅ Save to DB
  fetch('http://localhost:3001/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ content: msg })
  }).then(response => {
    if (response.ok) {
      // ✅ Emit to other users after DB save
      socket.emit('send-message', { 
        content: msg,
        sender: senderName
      });
    } else if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }).catch(err => {
    console.error('Error sending message:', err);
  });

  // ✅ Show your own message immediately
  const div = document.createElement('div');
  div.className = 'message sent';
  div.innerHTML = `
    <div class="sender">You</div>
    <div class="content">${msg}</div>
  `;
  messageBox.appendChild(div);
  messageBox.scrollTop = messageBox.scrollHeight;
  input.value = '';
  
  // Focus back to input after sending
  input.focus();
}

// ✅ Logout button handler
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

