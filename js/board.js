console.log('board.js loaded');

const BOARD_SIZE = 5;
const FREE_SPACE_INDEX = 12;

async function generateBingo() {
    console.log('Generating bingo board...');

    // Get references to input and button
    const input = document.getElementById('bibleReference');
    const button = document.querySelector('.input-group button');
    const bingoCard = document.getElementById('bingoCard');
    const loadingMessage = document.querySelector('.loading');

    if (loadingMessage) {
        loadingMessage.remove();
    }

    if (!input || !button || !bingoCard) {
        console.error('Could not find required elements');
        return;
    }

    try {
        // Disable input and button while generating
        input.disabled = true;
        button.disabled = true;

        // Show loading message in the bingo card area
        bingoCard.innerHTML = '<div class="loading">Generating Card...</div>';

        const reference = input.value.trim();
        const topics = await getSermonTopics(reference);

        await createBoard(topics);

    } catch (error) {
        console.error('Error generating bingo:', error);
        bingoCard.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    } finally {
        // Re-enable input and button
        if (input) input.disabled = false;
        if (button) button.disabled = false;
    }
}

async function createBoard(topics) {
    console.log('Creating board...');
    const bingoCard = document.getElementById('bingoCard');

    if (!bingoCard) {
        console.error('Could not find bingoCard element');
        return;
    }

    // Clear any existing content
    bingoCard.innerHTML = '';

    // Reset bingo states for new board
    resetBingoStates();

    // Create cells
    const shuffledTopics = shuffleArray([...topics]); // Create a copy before shuffling
    let cellIndex = 0;

    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell';

        // Center cell is always FREE
        if (i === 12) {
            cell.innerHTML = `
                <div class="cell-content free-space-content">
                    <svg class="star-background" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" pointer-events="none">
                        <defs>
                            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#FFA500;stop-opacity:1" />
                            </linearGradient>
                            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                                <feOffset dx="2" dy="2" result="offsetblur"/>
                                <feFlood flood-color="#000000" flood-opacity="0.3"/>
                                <feComposite in2="offsetblur" operator="in"/>
                                <feMerge>
                                    <feMergeNode/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        <path class="star" d="M50 0 L61 35 L97 35 L68 57 L79 91 L50 70 L21 91 L32 57 L3 35 L39 35 Z"
                            style="fill:url(#starGradient); filter:url(#shadow);" />
                        <path class="highlight" d="M50 0 L61 35 L97 35 L68 57 L79 91 L50 70"
                            style="fill:none; stroke:#FFE45C; stroke-width:2; opacity:0.6;" />
                    </svg>
                    <span class="free-text" pointer-events="none">FREE<br>SPACE</span>
                </div>
            `;
            cell.classList.add('free-space', 'marked');
        } else {
            const topic = shuffledTopics[cellIndex];
            if (topic) {
                const imageUrl = await getImageUrlFromDescription(topic.imageDescription);
                cell.innerHTML = `
                    <div class="cell-content">
                        ${imageUrl ? `<img src="${imageUrl}" alt="${topic.imageDescription}">` : ''}
                        <span class="cell-text">${topic.word}</span>
                    </div>
                `;
                cellIndex++;
            }
        }

        cell.addEventListener('click', () => toggleCell(cell));
        bingoCard.appendChild(cell);
    }
}

// Add window resize handler for responsive layout
let resizeTimeout;
window.addEventListener('resize', () => {
    // Debounce resize events
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const bingoCard = document.getElementById('bingoCard');
        if (bingoCard) {
            // Adjust layout if needed
            console.log('Window resized, adjusting layout');
        }
    }, 250);
});

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('bibleReference');
    const button = document.querySelector('.input-group button');

    if (input && button) {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                generateBingo();
            }
        });

        // Add click handler to button (if not already handled by onclick in HTML)
        button.addEventListener('click', generateBingo);
    } else {
        console.error('Could not find input or button elements during initialization');
    }
});

// Export the function for use in HTML
window.generateBingo = generateBingo;
