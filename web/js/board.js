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

        debug('Fetching sermon topics...');
        const topics = await getSermonTopics(reference);
        debug('Received topics:', topics);

        if (!topics || !Array.isArray(topics) || topics.length === 0) {
            debug('No topics received, using fallback');
            // Use fallback topics if none received
            const fallbackTopics = [
                { word: "Love", imageDescription: "heart symbol" },
                { word: "Faith", imageDescription: "praying hands" },
                { word: "Hope", imageDescription: "sunrise over mountains" },
                { word: "Grace", imageDescription: "dove in flight" },
                { word: "Peace", imageDescription: "olive branch" },
                { word: "Joy", imageDescription: "smiling face" },
                { word: "Truth", imageDescription: "open bible" },
                { word: "Light", imageDescription: "shining candle" },
                { word: "Life", imageDescription: "growing tree" },
                { word: "Cross", imageDescription: "wooden cross" },
                { word: "Prayer", imageDescription: "folded hands" },
                { word: "Mercy", imageDescription: "helping hands" },
                { word: "Spirit", imageDescription: "dove flying" },
                { word: "Word", imageDescription: "open bible pages" },
                { word: "Saved", imageDescription: "rescue lifeline" },
                { word: "Believe", imageDescription: "mountain faith" },
                { word: "Heaven", imageDescription: "clouds and light" },
                { word: "Glory", imageDescription: "sunburst" },
                { word: "Praise", imageDescription: "raised hands" },
                { word: "Holy", imageDescription: "flame" },
                { word: "Eternal", imageDescription: "infinity symbol" },
                { word: "Blessed", imageDescription: "rainbow" },
                { word: "Gospel", imageDescription: "scroll" },
                { word: "Amen", imageDescription: "praying hands" }
            ];
            await createBoard(fallbackTopics);
            return;
        }

        await createBoard(topics);
        debug('Board creation completed');

    } catch (error) {
        debug('Error generating bingo:', error);
        console.error('Error generating bingo:', error);
    } finally {
        isGenerating = false;
    }
}

async function createBoard(topics) {
    debug('Creating board with topics:', topics);
    const bingoCard = document.getElementById('bingoCard');

    if (!bingoCard) {
        debug('Could not find bingoCard element');
        return;
    }

    // Clear any existing content and remove any existing event listeners
    bingoCard.innerHTML = '';
    debug('Cleared existing board content');

    // Reset bingo states for new board
    resetBingoStates();
    debug('Reset bingo states');

    // Ensure exactly 24 topics (25th space is FREE)
    const shuffledTopics = shuffleArray([...topics]).slice(0, 24);
    debug('Shuffled and sliced topics:', shuffledTopics);
    let topicIndex = 0;

    // Phase 1: Create all cells with words
    const cells = [];
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell';

        // Center cell (index 12) is always FREE
        if (i === 12) {
            debug('Creating free space at index 12');
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
