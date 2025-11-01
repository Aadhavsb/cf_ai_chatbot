// Mystery definitions
const MYSTERIES = {
  dame: {
    title: "The Dame in Distress",
    intro: "*The rain's coming down in sheets. The kind of night that makes honest men question their choices. Then she walks in - red dress, trouble in her eyes. 'Detective,' she says, 'I need your help.' Course you do, sweetheart. They all do.*",
    context: "A mysterious woman has hired you to investigate. There's danger, secrets, and a web of lies to untangle."
  },
  murder: {
    title: "Murder at Midnight",
    intro: "*The call came in at 12:05 AM. Body at the Grandview Hotel, Room 412. The kind of joint where questions don't get asked until it's too late. Time to see what the night dragged in.*",
    context: "A murder at an upscale hotel. Multiple suspects, hidden motives, and technical clues including encrypted messages."
  },
  heist: {
    title: "The Diamond Heist",
    intro: "*The Cartwright Diamond. Five million in rocks, gone like smoke. No alarms, no witnesses, just an empty case and a calling card. This wasn't some two-bit smash and grab. This was art.*",
    context: "Priceless diamonds stolen from a high-security vault. Need to crack security codes, follow digital trails, and outwit a master thief."
  },
  cipher: {
    title: "The Encrypted Files",
    intro: "*The USB drive landed on my desk with a hollow click. No note, no return address. Just files locked up tighter than Fort Knox and a trail of bodies that leads to City Hall. Time to decrypt some truth.*",
    context: "A conspiracy involving encrypted files, dead drops, and coded messages. Requires solving ciphers, analyzing network logs, and uncovering a cover-up."
  },
  disappeared: {
    title: "The Vanishing Act",
    intro: "*Johnny Malone. Good kid, sharp mind - the kind that sees too much. He disappeared three days ago. The cops say he skipped town. His mother's crying says different. Time to find out which.*",
    context: "A missing persons case with digital footprints, hidden messages, and a conspiracy that goes deeper than anyone realizes."
  },
  freeform: {
    title: "Free Investigation",
    intro: "*Another day in this godforsaken city. The neon signs flicker, the jazz plays, and somewhere in the shadows, someone's got a problem only a private eye can solve. What's the case, partner?*",
    context: "Open-ended investigation. You set the case details and I'll help you solve it, noir-style."
  }
};

// Generate or retrieve conversation ID
function getConversationId() {
  let conversationId = localStorage.getItem('conversationId');
  if (!conversationId) {
    conversationId = 'case_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('conversationId', conversationId);
  }
  return conversationId;
}

let conversationId = getConversationId();
let currentMystery = localStorage.getItem('currentMystery') || null;
let caseTitle = localStorage.getItem('caseTitle') || 'Unsolved Case';

// DOM elements
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const newChatBtn = document.getElementById('newChatBtn');
const exportBtn = document.getElementById('exportBtn');
const messagesContainer = document.getElementById('messages');
const mysteryCards = document.querySelectorAll('.mystery-card');

// API base URL
const API_BASE = window.location.origin;

// Add message to UI
function addMessage(content, role) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;
  messageDiv.textContent = content;
  messageDiv.dataset.content = content;
  messageDiv.dataset.role = role;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.parentElement.scrollTop = messagesContainer.parentElement.scrollHeight;
}

// Add loading message
function addLoadingMessage() {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message loading';
  messageDiv.id = 'loading-message';
  messageDiv.textContent = '*The gears are turning... Give me a moment, I\'m putting the pieces together.*';
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

// Show detective response in noir overlay with typewriter effect
async function showNoirResponse(text) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('noirOverlay');
    const quoteElement = document.getElementById('detectiveQuote');

    // Clear previous content
    quoteElement.innerHTML = '';

    // Show overlay
    overlay.classList.add('active');

    // Typewriter effect
    let charIndex = 0;
    const typeSpeed = 30; // milliseconds per character

    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    quoteElement.appendChild(cursor);

    function typeCharacter() {
      if (charIndex < text.length) {
        // Insert character before cursor
        const textNode = document.createTextNode(text[charIndex]);
        quoteElement.insertBefore(textNode, cursor);
        charIndex++;
        setTimeout(typeCharacter, typeSpeed);
      } else {
        // Done typing, remove cursor after a moment
        setTimeout(() => {
          cursor.remove();

          // Hold the text for a moment
          setTimeout(() => {
            // Fade out
            overlay.classList.add('fade-out');

            // After fade completes, hide and resolve
            setTimeout(() => {
              overlay.classList.remove('active', 'fade-out');
              resolve();
            }, 500);
          }, 1500); // Hold for 1.5 seconds after typing
        }, 500);
      }
    }

    // Start typing after a brief delay
    setTimeout(typeCharacter, 300);
  });
}

// Send message to API
async function sendMessage(message) {
  if (!message.trim()) return;

  // Check if mystery is selected
  if (!currentMystery) {
    addMessage('Hold your horses, gumshoe. Pick a case first.', 'narration');
    return;
  }

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
        conversationId,
        mystery: currentMystery
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response');
    }

    const data = await response.json();

    // Remove loading
    removeLoadingMessage();

    // Show noir overlay with typewriter effect, then add to chat
    await showNoirResponse(data.response);
    addMessage(data.response, 'assistant');

  } catch (error) {
    console.error('Error:', error);
    removeLoadingMessage();
    addMessage('The line went dead... Something\'s wrong on the other end.', 'assistant');
  } finally {
    // Re-enable input
    messageInput.disabled = false;
    sendBtn.disabled = false;
    messageInput.focus();
  }
}

// Start new case
async function startNewCase() {
  try {
    // Reset conversation on server
    if (conversationId) {
      await fetch(`${API_BASE}/api/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId
        })
      });
    }

    // Generate new conversation ID
    conversationId = 'case_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('conversationId', conversationId);

    // Clear mystery selection
    currentMystery = null;
    localStorage.removeItem('currentMystery');
    localStorage.removeItem('caseTitle');

    // Clear active state from mystery cards
    mysteryCards.forEach(card => card.classList.remove('active'));

    // Clear UI
    messagesContainer.innerHTML = '';
    addMessage('*The case files are closed. The slate is clean. Time to pick a new mystery, detective.*', 'narration');

  } catch (error) {
    console.error('Error starting new case:', error);
  }
}

// Select mystery
function selectMystery(mysteryType) {
  const mystery = MYSTERIES[mysteryType];
  if (!mystery) return;

  currentMystery = mysteryType;
  caseTitle = mystery.title;

  localStorage.setItem('currentMystery', mysteryType);
  localStorage.setItem('caseTitle', mystery.title);

  // Update active state
  mysteryCards.forEach(card => {
    if (card.dataset.mystery === mysteryType) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });

  // Clear and show intro
  messagesContainer.innerHTML = '';
  addMessage(mystery.intro, 'narration');

  messageInput.focus();
}

// Export case to Word document
async function exportCase() {
  if (!currentMystery) {
    addMessage('No case to export, shamus. Start investigating first.', 'narration');
    return;
  }

  try {
    // Get all messages
    const messages = Array.from(messagesContainer.children)
      .filter(el => !el.classList.contains('loading'))
      .map(el => ({
        role: el.dataset.role || el.className.split(' ').find(c => c !== 'message'),
        content: el.dataset.content || el.textContent
      }));

    if (messages.length === 0) {
      addMessage('Nothing to export yet, detective. Get some evidence first.', 'narration');
      return;
    }

    // Create Word document content
    const timestamp = new Date().toLocaleString();
    const docContent = generateWordDocument(caseTitle, timestamp, messages);

    // Create blob and download
    const blob = new Blob([docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${caseTitle.replace(/\s+/g, '_')}_CaseFile_${Date.now()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addMessage('*Case file exported. Keep it safe, private eye. This could be evidence.*', 'narration');

  } catch (error) {
    console.error('Error exporting case:', error);
    addMessage('Couldn\'t export the case file. The typewriter\'s jammed.', 'narration');
  }
}

// Generate Word document HTML
function generateWordDocument(title, timestamp, messages) {
  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title} - Case File</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          background: #f5f5f5;
          padding: 40px;
          color: #1a1a1a;
        }
        .header {
          text-align: center;
          border-bottom: 3px double #1a1a1a;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        h1 {
          font-family: 'Impact', sans-serif;
          letter-spacing: 3px;
          margin: 0;
        }
        .subtitle {
          font-style: italic;
          margin-top: 10px;
        }
        .message {
          margin: 20px 0;
          padding: 15px;
          border-left: 3px solid #666;
        }
        .user {
          background: #e8e8e8;
          text-align: right;
          border-left-color: #444;
        }
        .assistant {
          background: #d8d8d8;
          border-left-color: #888;
        }
        .narration {
          background: #c8c8c8;
          font-style: italic;
          text-align: center;
          border-left: none;
          border-top: 1px solid #999;
          border-bottom: 1px solid #999;
        }
        .label {
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.9em;
          margin-bottom: 5px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🕵️ PRIVATE EYE CASE FILE 🕵️</h1>
        <h2>${title}</h2>
        <div class="subtitle">Case Closed: ${timestamp}</div>
      </div>
  `;

  const messageHTML = messages.map(msg => {
    const roleLabel = msg.role === 'user' ? 'YOUR MOVE' :
                     msg.role === 'assistant' ? 'DETECTIVE NOTES' :
                     'NARRATION';
    return `
      <div class="message ${msg.role}">
        <div class="label">${roleLabel}</div>
        <div>${msg.content}</div>
      </div>
    `;
  }).join('');

  const footer = `
      <div style="margin-top: 40px; padding-top: 20px; border-top: 3px double #1a1a1a; text-align: center; font-style: italic;">
        Case File Generated by Private EYE System<br>
        Keep this document confidential
      </div>
    </body>
    </html>
  `;

  return header + messageHTML + footer;
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
    if (history.length > 0) {
      history.forEach(msg => {
        addMessage(msg.content, msg.role);
      });

      // Restore mystery selection if exists
      if (currentMystery) {
        mysteryCards.forEach(card => {
          if (card.dataset.mystery === currentMystery) {
            card.classList.add('active');
          }
        });
      }
    } else {
      // Show initial message
      addMessage('*The city sleeps, but the Private EYE never does. Pick a case, detective. The night is young and trouble never takes a holiday.*', 'narration');
    }

  } catch (error) {
    console.error('Error loading history:', error);
    addMessage('*The city sleeps, but the Private EYE never does. Pick a case, detective. The night is young and trouble never takes a holiday.*', 'narration');
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

newChatBtn.addEventListener('click', startNewCase);
exportBtn.addEventListener('click', exportCase);

mysteryCards.forEach(card => {
  card.addEventListener('click', () => {
    selectMystery(card.dataset.mystery);
  });
});

// Load history on page load
loadHistory();

// Focus input on load
messageInput.focus();
