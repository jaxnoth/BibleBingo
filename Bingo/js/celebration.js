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
