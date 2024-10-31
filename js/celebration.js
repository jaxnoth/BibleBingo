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
function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';

    // Random starting position
    const startX = 50; // Start from center
    const startY = 50; // Start from center

    // Random angle and distance for burst effect
    const angle = Math.random() * Math.PI * 2;
    const velocity = 15 + Math.random() * 15;
    const rotationSpeed = (Math.random() - 0.5) * 720;

    // Set initial position
    confetti.style.left = `${startX}%`;
    confetti.style.top = `${startY}%`;

    // Random color
    const colors = [
        '#ff0000', '#00ff00', '#0000ff',
        '#ffff00', '#ff00ff', '#00ffff',
        '#ffa500', '#800080', '#ffc0cb'
    ];
    confetti.style.backgroundColor = getRandomItem(colors);

    document.body.appendChild(confetti);

    // Animate using requestAnimationFrame
    let startTime = performance.now();
    const duration = 1000 + Math.random() * 1000; // Random duration between 1-2s

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
            // Calculate position based on burst pattern
            const distance = velocity * progress * 50;
            const x = startX + (Math.cos(angle) * distance);
            const y = startY + (Math.sin(angle) * distance) + (progress * progress * 200);

            // Update position and rotation
            confetti.style.transform = `
                translate(${x - startX}%, ${y - startY}%)
                rotate(${rotationSpeed * progress}deg)
                scale(${1 - progress * 0.5})`;

            confetti.style.opacity = 1 - progress;

            requestAnimationFrame(animate);
        } else {
            confetti.remove();
        }
    }

    requestAnimationFrame(animate);
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
        bingoMessage.classList.remove('show'); // Reset animation
        void bingoMessage.offsetWidth; // Force reflow
        bingoMessage.classList.add('show');
    }

    // Create confetti
    const colors = ['#ffd700', '#ff0000', '#00ff00', '#0000ff', '#ff00ff'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        createConfetti(colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.backgroundColor = color;
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDuration = (Math.random() * 2 + 1) + 's'; // Reduced duration
    confetti.style.opacity = Math.random();

    document.body.appendChild(confetti);

    // Remove confetti sooner
    setTimeout(() => {
        confetti.remove();
    }, 2000); // Reduced from 5000
}

function playWinSound() {
    const audio = new Audio('sounds/win.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Sound autoplay blocked'));
}

window.celebrateSuperBingo = function() {
    console.log('SUPER BINGO!');

    // Show SUPER BINGO! message
    const bingoMessage = document.getElementById('bingoMessage');
    if (bingoMessage) {
        bingoMessage.textContent = 'SUPER BINGO!';
        bingoMessage.style.color = '#FFD700'; // Golden color
        bingoMessage.style.fontSize = '5rem';  // Bigger text
        bingoMessage.classList.remove('show');
        void bingoMessage.offsetWidth;
        bingoMessage.classList.add('show');
    }

    // Create extra confetti for super bingo
    const colors = ['#ffd700', '#ffd700', '#ff0000', '#00ff00', '#0000ff']; // More gold
    const confettiCount = 200; // Extra confetti

    for (let i = 0; i < confettiCount; i++) {
        createConfetti(colors[Math.floor(Math.random() * colors.length)]);
    }

    // Reset message style after animation
    setTimeout(() => {
        if (bingoMessage) {
            bingoMessage.style.color = '';
            bingoMessage.style.fontSize = '';
        }
    }, 2000);
};
