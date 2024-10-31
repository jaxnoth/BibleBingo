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
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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

// Add this fallback data
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

async function getSermonTopics(reference) {
    console.log('Getting topics for reference:', reference);

    if (!reference || reference.trim() === '') {
        console.log('No reference provided, using default topics');
        return shuffleArray([...fallbackTopics]);
    }

    if (!window.env?.GROQ_API_KEY) {
        console.log('GROQ API key not configured in env.js, using default topics');
        return shuffleArray([...fallbackTopics]);
    }

    try {
        const result = await Promise.race([
            fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${window.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "mixtral-8x7b-32768",
                    messages: [
                        {
                            role: "user",
                            content: `Generate exactly 24 unique, single-word sermon topics related to Bible verse ${reference}.
                                Return as a JSON array of objects with 'word' and 'imageDescription' properties.
                                Example format: {"topics": [
                                    {"word": "Love", "imageDescription": "heart symbol"},
                                    {"word": "Faith", "imageDescription": "praying hands"}
                                ]}
                                You must return EXACTLY 24 topics, no more, no less.
                                Keep image descriptions simple and clear.
                                Do not use complex or abstract descriptions.`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024,
                    response_format: { type: "json_object" }
                })
            }).then(async response => {
                if (!response.ok) {
                    throw new Error(`API response not ok: ${response.status}`);
                }
                return response.json();
            }),

            new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Using fallback topics due to timeout')), 15000);
            })
        ]);

        console.log('API Response:', result); // Debug log

        const content = result.choices[0].message.content;
        console.log('Content:', content); // Debug log

        try {
            const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
            console.log('Parsed Content:', parsedContent); // Debug log

            // Try different possible structures
            const topics = parsedContent.topics || parsedContent.sermonTopics || parsedContent;

            if (!Array.isArray(topics)) {
                console.log('Topics is not an array:', topics);
                return shuffleArray([...fallbackTopics]);
            }

            if (topics.length < 24) {
                console.log('Not enough topics:', topics.length);
                return shuffleArray([...fallbackTopics]);
            }

            // Validate topic format
            const validTopics = topics.every(topic =>
                topic.word &&
                typeof topic.word === 'string' &&
                topic.imageDescription &&
                typeof topic.imageDescription === 'string'
            );

            if (!validTopics) {
                console.log('Invalid topic format in:', topics);
                return shuffleArray([...fallbackTopics]);
            }

            return topics;

        } catch (e) {
            console.error('JSON parse error:', e);
            return shuffleArray([...fallbackTopics]);
        }

    } catch (error) {
        console.log('API error:', error.message);
        return shuffleArray([...fallbackTopics]);
    }
}
