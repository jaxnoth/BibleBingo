console.log('board.js loaded');

const BOARD_SIZE = 5;
const FREE_SPACE_INDEX = 12;

// Debug mode for localhost
const DEBUG = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

function debug(...args) {
    if (DEBUG) {
        console.log('[DEBUG]', ...args);
    }
}

let isGenerating = false;

async function generateBingo() {
    if (isGenerating) {
        debug('Already generating a board, please wait...');
        return;
    }

    try {
        isGenerating = true;
        debug('Starting board generation...');

        // Clear image cache before generating new board
        window.clearImageCache();
        debug('Image cache cleared');

        const referenceInput = document.getElementById('bibleReference');
        const reference = referenceInput ? referenceInput.value : '';
        debug('Bible reference:', reference);

        const { topics, usedFallback, fallbackReason, tagline } = await getSermonTopics(reference);
        await createBoard(topics, usedFallback, fallbackReason, tagline);

    } catch (error) {
        debug('Error generating bingo:', error);
        console.error('Error generating bingo:', error);
    } finally {
        isGenerating = false;
    }
}

const DEFAULT_TAGLINE = 'Kids during the service';

async function createBoard(topics, usedFallback, fallbackReason, tagline) {
    debug('Creating board...');
    const bingoCard = document.getElementById('bingoCard');

    if (!bingoCard) {
        debug('Could not find bingoCard element');
        return;
    }

    // Update header tagline from message summary (or default when fallback / no tagline)
    const taglineEl = document.getElementById('header-tagline');
    if (taglineEl) {
        taglineEl.textContent = (tagline && tagline.trim()) ? tagline.trim() : DEFAULT_TAGLINE;
    }

    // Update subtle fallback indicator (remove previous, show only when fallback was used)
    const existingIndicator = document.getElementById('fallback-indicator');
    if (existingIndicator) existingIndicator.remove();

    if (usedFallback) {
        const inputSection = document.querySelector('.input-section');
        if (inputSection && inputSection.parentNode) {
            const indicator = document.createElement('p');
            indicator.id = 'fallback-indicator';
            indicator.className = 'fallback-indicator';
            indicator.setAttribute('aria-label', 'Board uses default word list');
            indicator.textContent = 'Default word list';
            if (fallbackReason) {
                indicator.title = fallbackReason;
            }
            inputSection.parentNode.insertBefore(indicator, inputSection.nextSibling);
        }
    }

    // Clear any existing content and remove any existing event listeners
    bingoCard.innerHTML = '';
    debug('Cleared existing board content');

    // Reset bingo states for new board
    resetBingoStates();
    debug('Reset bingo states');

    // Ensure exactly 24 topics (25th space is FREE) — all from API when not fallback
    const shuffledTopics = shuffleArray([...topics]).slice(0, 24);
    if (!usedFallback && topics.length > 0) {
        debug('[Bible Bingo] Board using', shuffledTopics.length, 'topics from API:', shuffledTopics.map(t => t.word).join(', '));
    }
    let topicIndex = 0;

    // Phase 1: Create all cells with words
    const cells = [];
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell';

        // Center cell (index 12) is always FREE — church logo + text
        if (i === 12) {
            debug('Creating free space at index 12');
            cell.innerHTML = `
                <div class="cell-content free-space-content">
                    <img src="images/logo.png" alt="" class="free-space-logo" width="80" height="80">
                    <span class="free-text" pointer-events="none">FREE SPACE</span>
                </div>
            `;
            cell.classList.add('free-space', 'marked');
        } else {
            if (topicIndex < shuffledTopics.length) {
                const topic = shuffledTopics[topicIndex++];
                debug('Creating cell for topic:', topic);
                if (topic) {
                    cell.innerHTML = `
                        <div class="cell-content">
                            <span class="cell-text">${topic.word}</span>
                        </div>
                    `;
                    // Store the topic with the cell for later image loading
                    cells.push({ cell, topic });
                }
            }
        }

        // Add click event listener
        cell.addEventListener('click', () => handleCellClick(cell));
        bingoCard.appendChild(cell);
    }

    debug('Board creation completed, cells added to DOM');

    // Phase 2: Load images asynchronously
    debug('Starting async image loading for', cells.length, 'cells');
    cells.forEach(({ cell, topic }) => {
        (async () => {
            try {
                const imageUrl = await getImageUrlFromDescription(topic.imageDescription);
                debug('Got image URL:', imageUrl);
                if (imageUrl) {
                    cell.style.backgroundImage = `url('${imageUrl}')`;
                }
            } catch (error) {
                debug('Error loading image:', error);
            }
        })();
    });
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
