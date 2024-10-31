/**
 * Celebrate a new bingo line
 */
function celebrateBingo() {
    log('Celebrating bingo!');

    // Create celebration text
    const celebrationText = document.createElement('div');
    celebrationText.className = 'celebration-text';
    celebrationText.textContent = 'BINGO!';
    document.body.appendChild(celebrationText);

    // Create confetti burst
    for (let i = 0; i < 50; i++) {
        setTimeout(() => createConfetti(), i * 20);
    }

    // Play celebration sound if enabled
    const audio = document.getElementById('bingoSound');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => log('Sound play failed:', e));
    }

    // Remove celebration text after animation
    setTimeout(() => {
        celebrationText.remove();
    }, 2000);
}

/**
 * Celebrate a full board completion
 */
function celebrateFullBoard() {
    log('Celebrating full board!');

    // Create super bingo text
    const celebrationText = document.createElement('div');
    celebrationText.className = 'blackout-text';
    celebrationText.textContent = 'SUPER BINGO!';
    document.body.appendChild(celebrationText);

    // Create extra confetti burst
    for (let i = 0; i < 150; i++) {
        setTimeout(() => createConfetti(), i * 20);
    }

    // Play celebration sound if enabled
    const audio = document.getElementById('bingoSound');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => log('Sound play failed:', e));
    }

    // Remove celebration text after animation
    setTimeout(() => {
        celebrationText.remove();
    }, 3000);
}

/**
 * Create a single confetti piece
 */
function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';

    // Start from center of viewport
    confetti.style.top = '50%';
    confetti.style.left = '50%';

    // Calculate random final position
    const angle = Math.random() * Math.PI * 2; // Random angle in radians
    const distance = 200 + Math.random() * 300; // Random distance (200-500px)

    // Calculate final position using trigonometry
    const finalX = Math.cos(angle) * distance;
    const finalY = Math.sin(angle) * distance;
    const rotation = Math.random() * 720 - 360; // Random rotation -360° to 360°

    // Set CSS variables for the animation
    confetti.style.setProperty('--final-x', `${finalX}px`);
    confetti.style.setProperty('--final-y', `${finalY}px`);
    confetti.style.setProperty('--rotation', `${rotation}deg`);

    // Set other styles
    confetti.style.backgroundColor = color;
    confetti.style.opacity = Math.random() * 0.7 + 0.3;

    document.body.appendChild(confetti);

    // Remove confetti after animation
    setTimeout(() => {
        confetti.remove();
    }, 2000);
}

/**
 * Play a celebration sound
 * @returns {Promise} Resolves when sound is played
 */
async function playSound() {
    const audio = document.getElementById('bingoSound');
    if (audio) {
        try {
            audio.currentTime = 0;
            await audio.play();
        } catch (error) {
            log('Sound play failed:', error);
        }
    }
}

/**
 * Cleanup any existing celebrations before starting new ones
 */
function cleanupExistingCelebrations() {
    const existingContainer = document.getElementById('confetti-container');
    if (existingContainer) existingContainer.remove();

    const existingMessage = document.querySelector('.celebration-message');
    if (existingMessage) existingMessage.remove();
}

/**
 * Start a celebration
 */
function startCelebration() {
    cleanupExistingCelebrations();
    console.log('Starting celebration');

    // Create confetti container if it doesn't exist
    let confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) {
        confettiContainer = document.createElement('div');
        confettiContainer.id = 'confetti-container';
        document.body.appendChild(confettiContainer);
    }

    // Clear any existing confetti
    confettiContainer.innerHTML = '';

    // Create confetti pieces
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.setProperty('--delay', `${Math.random() * 5}s`);
        confetti.style.setProperty('--rotation', `${Math.random() * 360}deg`);
        confetti.style.setProperty('--x', `${Math.random() * 100}vw`);
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
        confettiContainer.appendChild(confetti);
    }

    // Show celebration message
    const message = document.createElement('div');
    message.className = 'celebration-message';
    message.textContent = 'BINGO!';
    document.body.appendChild(message);

    // Remove celebration after animation
    setTimeout(() => {
        confettiContainer.remove();
        message.remove();
    }, 5000);
}

function startSuperCelebration() {
    cleanupExistingCelebrations();
    console.log('Starting super celebration');

    // Create more confetti
    let confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) {
        confettiContainer = document.createElement('div');
        confettiContainer.id = 'confetti-container';
        document.body.appendChild(confettiContainer);
    }

    confettiContainer.innerHTML = '';

    // Create lots of golden confetti
    for (let i = 0; i < 200; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti super-confetti';
        confetti.style.setProperty('--delay', `${Math.random() * 5}s`);
        confetti.style.setProperty('--rotation', `${Math.random() * 360}deg`);
        confetti.style.setProperty('--x', `${Math.random() * 100}vw`);
        // Golden colors
        confetti.style.backgroundColor = `hsl(${40 + Math.random() * 20}, 100%, ${50 + Math.random() * 20}%)`;
        confettiContainer.appendChild(confetti);
    }

    // Show super celebration message
    const message = document.createElement('div');
    message.className = 'celebration-message super';
    message.textContent = 'SUPER BINGO!';
    message.style.color = 'gold';
    message.style.fontSize = '5rem';
    document.body.appendChild(message);

    // Remove celebration after animation
    setTimeout(() => {
        confettiContainer.remove();
        message.remove();
    }, 6000);
}

// Cleanup on page unload
window.addEventListener('unload', cleanupExistingCelebrations);

// Make celebrateWin available globally
window.celebrateWin = function() {
    console.log('BINGO!');

    // Show BINGO! message
    const bingoMessage = document.getElementById('bingoMessage');
    if (bingoMessage) {
        bingoMessage.textContent = 'BINGO!';
        bingoMessage.classList.remove('show');
        void bingoMessage.offsetWidth;
        bingoMessage.classList.add('show');
    }

    // Create confetti in waves
    const colors = ['#ffd700', '#ff0000', '#00ff00', '#0000ff', '#ff00ff'];
    const confettiCount = 50;

    // Create confetti in multiple waves for better effect
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 20); // Stagger the creation
    }
};

window.celebrateSuperBingo = function() {
    console.log('SUPER BINGO!');

    const bingoMessage = document.getElementById('bingoMessage');
    if (bingoMessage) {
        bingoMessage.textContent = 'SUPER BINGO!';
        bingoMessage.style.color = '#FFD700';
        bingoMessage.style.fontSize = '5rem';
        bingoMessage.classList.remove('show');
        void bingoMessage.offsetWidth;
        bingoMessage.classList.add('show');
    }

    // More confetti for super bingo
    const colors = ['#ffd700', '#ffd700', '#ff0000', '#00ff00', '#0000ff'];
    const confettiCount = 200;

    // Create confetti in multiple waves
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 10); // Faster waves for super bingo
    }

    setTimeout(() => {
        if (bingoMessage) {
            bingoMessage.style.color = '';
            bingoMessage.style.fontSize = '';
        }
    }, 2000);
};

function playWinSound() {
    const audio = new Audio('sounds/win.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Sound autoplay blocked'));
}
