document.addEventListener('DOMContentLoaded', function() {
    // Debug elements
    console.log('DOM Content Loaded');
    
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendMessage');
    let isLoading = false;

    // Providers Modal Elements
    const providersLink = document.getElementById('providersLink');
    const providersModal = document.getElementById('providersModal');
    const closeProviders = document.getElementById('closeProviders');

    // Providers Modal Functionality
    function setupModal(modalId, openButtonId, closeButtonId) {
        const modal = document.getElementById(modalId);
        const openButton = document.getElementById(openButtonId);
        const closeButton = document.getElementById(closeButtonId);

        openButton.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
            document.body.style.overflow = 'hidden';  // Prevent background scrolling
        });

        closeButton.addEventListener('click', function() {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
            document.body.style.overflow = '';
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
                document.body.style.overflow = '';
            }
        });
    }

    // Setup both modals
    setupModal('providersModal', 'providersLink', 'closeProviders');
    setupModal('aboutUsModal', 'aboutUsLink', 'closeAboutUs');

    // Debug logs
    console.log('Providers Link:', providersLink);
    console.log('Providers Modal:', providersModal);
    console.log('Close Button:', closeProviders);

    if (!providersLink) console.error('Providers link not found!');
    if (!providersModal) console.error('Providers modal not found!');
    if (!closeProviders) console.error('Close button not found!');

    function addMessage(message, isUser = false) {
        console.log('Adding message:', { message, isUser }); // Debug
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        if (isUser) {
            messageDiv.textContent = message;
        } else {
            // Start empty for AI messages
            messageDiv.textContent = '';
            typeMessage(messageDiv, message);
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function typeMessage(element, message) {
        const typingSpeed = 10; // Milliseconds per character
        let userScrolled = false;

        // Add scroll event listener
        const scrollHandler = () => {
            userScrolled = true;
        };
        chatMessages.addEventListener('scroll', scrollHandler);
        
        for (let i = 0; i < message.length; i++) {
            element.textContent += message[i];
            // Only auto-scroll if user hasn't manually scrolled up
            if (!userScrolled) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            await new Promise(resolve => setTimeout(resolve, typingSpeed));
        }

        // Remove scroll listener
        chatMessages.removeEventListener('scroll', scrollHandler);
    }

    // Replace with your actual Render.com backend URL
    const BACKEND_URL = 'https://aiboy-backend.onrender.com'; // Update this

    async function handleSendMessage() {
        const message = userInput.value.trim();
        console.log('Sending message:', message); // Debug

        if (!message) {
            console.log('Empty message, returning'); // Debug
            return;
        }

        try {
            // Disable input while processing
            userInput.disabled = true;
            sendButton.disabled = true;

            // Show user message
            addMessage(message, true);
            userInput.value = '';

            console.log('Making fetch request...'); // Debug
            const response = await fetch(`${BACKEND_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            console.log('Raw response:', response); // Debug
            const data = await response.json();
            console.log('Parsed data:', data); // Debug

            // Add AI response - using data.message instead of data.response
            addMessage(data.message, false);

        } catch (error) {
            console.error('Error in handleSendMessage:', error);
            addMessage('Sorry, there was an error processing your request.', false);
        } finally {
            // Re-enable input after processing
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
        }
    }

    // Event listeners
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            console.log('Send button clicked'); // Debug
            handleSendMessage();
        });
    }

    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('Enter key pressed'); // Debug
                handleSendMessage();
            }
        });
    }

    // Add initial message
    addMessage('Welcome! I am AIBOY. How can I help you today?', false);

    // Wallet connection
    async function connectWallet() {
        try {
            // Check if on mobile
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            
            if (!window.solana) {
                if (isMobile) {
                    // Deep link to Phantom app
                    window.location.href = 'https://phantom.app/ul/browse/' + window.location.href;
                    return;
                } else {
                    const install = confirm('Phantom wallet is not installed. Would you like to install it?');
                    if (install) {
                        window.open('https://phantom.app/', '_blank');
                    }
                    return;
                }
            }

            const connectButton = document.getElementById('connectWallet');
            connectButton.textContent = 'Connecting...';

            try {
                const resp = await window.solana.connect();
                const publicKey = resp.publicKey.toString();
                const shortKey = `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
                connectButton.textContent = shortKey;
                connectButton.classList.add('connected');
            } catch (err) {
                console.error('Connection error:', err);
                connectButton.textContent = 'CONNECT WALLET';
                if (err.code === 4001) {
                    alert('Please accept the connection request in Phantom');
                } else {
                    alert('Failed to connect. Please try again.');
                }
            }
        } catch (error) {
            console.error('Wallet error:', error);
            connectButton.textContent = 'CONNECT WALLET';
            alert('Error connecting to wallet. Please try again.');
        }
    }

    document.getElementById('connectWallet').addEventListener('click', connectWallet);

    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && providersModal.classList.contains('active')) {
            providersModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}); 
