/**
 * Debug logging function
 * @param {...any} args - Arguments to log
 */

function log(...args) {
    if (DEBUG) {
        console.log('[Bingo]', ...args);
    }
}

/**
 * Display error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    // Position at top of bingo card
    const bingoCard = document.getElementById('bingoCard');
    bingoCard.parentNode.insertBefore(errorDiv, bingoCard);

    // Remove after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

/**
 * Get image URL for a given description
 * @param {string} description - Image description to search for
 * @returns {Promise<string|null>} Image URL or null if not found
 */
async function getImageUrlFromDescription(description) {
    log('Getting image for description:', description);

    try {
        const searchTerm = wordToSearchTerm(description);

        // Check cache first
        if (imageCache.has(searchTerm)) {
            log('Cache hit for:', searchTerm);
            const cachedUrl = imageCache.get(searchTerm);
            if (!usedImages.has(cachedUrl)) {
                usedImages.add(cachedUrl);
                return cachedUrl;
            }
            log('Cached image already used, fetching new one');
        }

        log('Cache miss for:', searchTerm);
        // Construct Pixabay API URL
        const apiUrl = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(searchTerm)}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFE_SEARCH}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.hits && data.hits.length > 0) {
            // Get random image from results
            const unusedHits = data.hits.filter(hit => !usedImages.has(hit.webformatURL));
            if (unusedHits.length > 0) {
                const randomHit = unusedHits[Math.floor(Math.random() * unusedHits.length)];
                const imageUrl = randomHit.webformatURL;

                // Cache the URL and mark as used
                log('Caching new image for:', searchTerm);
                imageCache.set(searchTerm, imageUrl);
                usedImages.add(imageUrl);

                return imageUrl;
            }
        }

        log('No images found, using fallback');
        return createColoredBackground(description);
    } catch (error) {
        console.error('Error fetching image:', error);
        return createColoredBackground(description);
    }
}

/**
 * Creates a data URL for a colored background based on the description
 * @param {string} description - The description to base the color on
 * @returns {string} - A data URL containing a colored SVG
 */
function createColoredBackground(description) {
    // Generate a consistent hash from the description
    const hash = description.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    // Generate hue in the green range (90-150)
    const h = 90 + (Math.abs(hash) % 60);  // Hue between 90-150 (green range)
    const s = 40 + (Math.abs(hash >> 8) % 30);  // Saturation 40-70%
    const l = 75 + (Math.abs(hash >> 16) % 15);  // Lightness 75-90%

    // Create an SVG with the generated color
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
            <rect width="100" height="100" fill="hsl(${h}, ${s}%, ${l}%)" />
        </svg>
    `;

    // Convert SVG to data URL
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Get a random item from an array
 * @param {Array} array - Array to get item from
 * @returns {*} Random item from array
 */
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Check if an element is visible in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is visible
 */
function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
