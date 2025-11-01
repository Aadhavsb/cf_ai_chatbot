// Generate or retrieve conversation ID
function getConversationId() {
  let conversationId = localStorage.getItem('conversationId');
  if (!conversationId) {
    conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('conversationId', conversationId);
  }
  return conversationId;
}

let conversationId = getConversationId();

// DOM elements
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const newChatBtn = document.getElementById('newChatBtn');
const messagesContainer = document.getElementById('messages');

// API base URL - will be the current origin when deployed
const API_BASE = window.location.origin;

// Add message to UI
function addMessage(content, role) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;
  messageDiv.textContent = content;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.parentElement.scrollTop = messagesContainer.parentElement.scrollHeight;
}

// Add loading message
function addLoadingMessage() {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message loading';
  messageDiv.id = 'loading-message';
  messageDiv.textContent = 'Thinking...';
  messagesContainer.appendChild(messageDiv);
  messagesContainer.parentElement.scrollTop = messagesContainer.parentElement.scrollHeight;
}

// Remove loading message
function removeLoadingMessage() {
  const loadingMessage = document.getElementById('loading-message');
  if (loadingMessage) {
    loadingMessage.remove();
  }
}

// Send message to API
async function sendMessage(message) {
  if (!message.trim()) return;

  // Disable input while processing
  messageInput.disabled = true;
  sendBtn.disabled = true;

  // Add user message to UI
  addMessage(message, 'user');

  // Clear input
  messageInput.value = '';

  // Show loading
  addLoadingMessage();

  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response');
    }

    const data = await response.json();

    // Remove loading and add AI response
    removeLoadingMessage();
    addMessage(data.response, 'assistant');

  } catch (error) {
    console.error('Error:', error);
    removeLoadingMessage();
    addMessage('Sorry, something went wrong. Please try again.', 'assistant');
  } finally {
    // Re-enable input
    messageInput.disabled = false;
    sendBtn.disabled = false;
    messageInput.focus();
  }
}

// Start new chat
async function startNewChat() {
  try {
    // Reset conversation on server
    await fetch(`${API_BASE}/api/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId
      })
    });

    // Generate new conversation ID
    conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('conversationId', conversationId);

    // Clear UI
    messagesContainer.innerHTML = '';

  } catch (error) {
    console.error('Error starting new chat:', error);
  }
}

// Load conversation history
async function loadHistory() {
  try {
    const response = await fetch(`${API_BASE}/api/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId
      })
    });

    if (!response.ok) {
      return;
    }

    const history = await response.json();

    // Display history
    history.forEach(msg => {
      addMessage(msg.content, msg.role);
    });

  } catch (error) {
    console.error('Error loading history:', error);
  }
}

// Event listeners
sendBtn.addEventListener('click', () => {
  sendMessage(messageInput.value);
});

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage(messageInput.value);
  }
});

newChatBtn.addEventListener('click', startNewChat);

// Load history on page load
loadHistory();

// Focus input on load
messageInput.focus();
