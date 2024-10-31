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

    // Clear any existing content (including loading message)
    bingoCard.innerHTML = '';

    // Reset bingo states for new board
    resetBingoStates();

    // Function to generate a consistent color from text
    function stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        // Generate pastel colors for better text visibility
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 85%)`; // Pastel version
    }

    // Shuffle the topics
    const shuffledTopics = [...topics].sort(() => Math.random() - 0.5);

    // Create a 5x5 grid
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell';

        // Add FREE space in the middle
        if (i === FREE_SPACE_INDEX) {
            cell.classList.add('free-space');

            // Add star SVG
            const starSvg = `
                <svg viewBox="0 0 51 48" class="star-icon">
                    <path d="M25.5 0L31.4 18.3H50.5L35 29.6L40.9 47.9L25.5 36.6L10.1 47.9L16 29.6L0.5 18.3H19.6L25.5 0Z"
                          fill="currentColor"/>
                </svg>
            `;
            cell.innerHTML = starSvg + '<span>FREE</span>';
        } else {
            // Get topic from shuffled array, accounting for FREE space
            const topicIndex = i > FREE_SPACE_INDEX ? i - 1 : i;
            const topic = shuffledTopics[topicIndex];

            // Set a background color based on the word
            const backgroundColor = stringToColor(topic.word);
            cell.style.backgroundColor = backgroundColor;

            try {
                const imageUrl = await getImageUrlFromDescription(topic.imageDescription);
                if (imageUrl) {
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.alt = topic.word;
                    img.onerror = () => {
                        img.style.display = 'none'; // Hide broken image
                        cell.style.backgroundColor = backgroundColor; // Ensure background color is visible
                    };
                    cell.appendChild(img);
                }
            } catch (error) {
                console.error('Error loading image:', error);
                // Background color will show as fallback
            }

            const text = document.createElement('span');
            text.textContent = topic.word;
            cell.appendChild(text);
        }

        cell.onclick = () => {
            cell.classList.toggle('selected');
            console.log('Cell clicked:', cell.textContent);
            checkForBingo();
        };

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
