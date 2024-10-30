/**
 * Generate a new bingo board
 */
async function generateBingo() {
    console.log('Starting generateBingo');
    try {
        celebratedLines.clear();
        const reference = document.getElementById('bibleReference').value;

        let topics;
        if (!reference.trim()) {
            console.log('No reference, using local generation');
            topics = await generateLocalBingoCard();
        } else {
            try {
                console.log('Using reference:', reference);
                topics = await getSermonTopics(reference);
                topics[12] = { word: 'FREE', imageDescription: 'star' };
            } catch (aiError) {
                console.log('AI failed, falling back to local');
                topics = await generateLocalBingoCard();
            }
        }

        console.log('Got topics:', topics);
        await createBingoCard(topics);
        console.log('Board created');
    } catch (error) {
        console.error('Fatal error in generateBingo:', error);
        showError('Error generating bingo card. Please try again.');
    }
}

/**
 * Generate a local bingo card with predefined words
 * @returns {Array} Array of topic objects
 */
async function generateLocalBingoCard() {
    log('Generating local bingo card');

    // Create a Set to track used words
    const usedWords = new Set();
    const finalWords = [];

    // Combine all available words that have images
    const allWords = Object.values(wordLists).flat()
        .filter(word => imageDescriptions[word])
        .filter(word => word !== 'FREE');

    log(`Total available words with images: ${allWords.length}`);

    // Shuffle all words
    const shuffledWords = shuffleArray(allWords);

    // Select first 24 unique words
    for (let i = 0; i < shuffledWords.length && finalWords.length < 24; i++) {
        const word = shuffledWords[i];
        if (!usedWords.has(word)) {
            usedWords.add(word);
            finalWords.push(word);
        }
    }

    // If we don't have enough words, add from fallback list
    while (finalWords.length < 24) {
        const fallbackWord = getRandomItem(fallbackWords);
        if (!usedWords.has(fallbackWord)) {
            usedWords.add(fallbackWord);
            finalWords.push(fallbackWord);
        }
    }

    // Create the final array with FREE in the middle
    const result = [];
    for (let i = 0; i < 25; i++) {
        if (i === 12) {
            result.push({ word: 'FREE', imageDescription: 'star' });
        } else if (i < 12) {
            result.push({
                word: finalWords[i],
                imageDescription: imageDescriptions[finalWords[i]]
            });
        } else {
            result.push({
                word: finalWords[i - 1],
                imageDescription: imageDescriptions[finalWords[i - 1]]
            });
        }
    }

    log('Final word list generated:', result);
    return result;
}

/**
 * Get sermon topics from AI
 * @param {string} reference - Bible reference
 * @returns {Promise<Array>} Array of topic objects
 */
async function getSermonTopics(reference) {
    const prompt = `Given the Bible reference "${reference}", create a list of 24 single words related to its themes and message. These should be simple, clear words suitable for a Bible study bingo game. Include a mix of:
    - Key actions or verbs from the passage
    - Important objects or symbols mentioned
    - Themes or concepts discussed
    - Character traits demonstrated
    Format each word with a relevant image description. Format the response as a JSON array where each element has 'word' and 'imageDescription' properties. The image descriptions should be simple terms like: cross, bible, heart, star, angel, church, dove, fish, crown, light, water, bread, lamb, scroll.
    Don't use any number related words.
    Example format:
    [
        {"word": "PRAY", "imageDescription": "pray"},
        {"word": "FAITH", "imageDescription": "cross"}
    ]`;

    try {
        log('Making API request to Groq...');

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.GROQ_API_KEY}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [{
                    role: "user",
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (response.status === 401) {
            console.error('Authentication failed. Please check your Groq API key.');
            throw new Error('Invalid API key. Please check your configuration.');
        }

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Details:', errorData);
            throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        log('Successful response from Groq');
        log('Raw response content:', data.choices[0].message.content);

        const content = data.choices[0].message.content;
        let wordList;
        try {
            wordList = JSON.parse(content);
        } catch (e) {
            console.error('Failed to parse JSON response:', e);
            return content.split('\n').filter(line => line.trim()).slice(0, 24).map(word => ({
                word: word.trim().toUpperCase(),
                imageDescription: normalizeDescription(word.trim())
            }));
        }

        // Get 24 topics and normalize their descriptions
        const topics = wordList.slice(0, 24).map(topic => ({
            word: topic.word.toUpperCase(),
            imageDescription: normalizeDescription(topic.imageDescription)
        }));

        // Create the final array with FREE in the middle
        const finalTopics = [
            ...topics.slice(0, 12),
            { word: 'FREE', imageDescription: 'star' },
            ...topics.slice(12)
        ];

        return finalTopics;
    } catch (error) {
        console.error('Detailed error:', error);
        return generateLocalBingoCard();
    }
}

/**
 * Create the bingo card in the DOM
 * @param {Array} topics - Array of topic objects
 */
async function createBingoCard(topics) {
    log('Creating bingo card with topics:', topics);

    const bingoCard = document.getElementById('bingoCard');
    bingoCard.innerHTML = '';

    // Verify we have exactly 25 topics
    if (topics.length !== 25) {
        console.error(`Invalid number of topics: ${topics.length}`);
        const usedFallbacks = new Set();

        while (topics.length < 25) {
            const availableFallbacks = fallbackWords.filter(word => !usedFallbacks.has(word));

            if (availableFallbacks.length === 0) {
                usedFallbacks.clear();
            }

            const fallbackWord = getRandomItem(availableFallbacks);
            topics.push({
                word: fallbackWord,
                imageDescription: imageDescriptions[fallbackWord]
            });

            usedFallbacks.add(fallbackWord);
        }
        topics = topics.slice(0, 25);
    }

    // Create all cells
    topics.forEach((topic, index) => {
        const cell = createBingoCell(topic, index);
        bingoCard.appendChild(cell);
    });
}

/**
 * Create a single bingo cell
 * @param {Object} topic - Topic object with word and imageDescription
 * @param {number} index - Cell index (0-24)
 * @returns {HTMLElement} The created cell element
 */
function createBingoCell(topic, index) {
    const cell = document.createElement('div');
    cell.className = 'bingo-cell loading';

    // Create background image container
    const bgImage = document.createElement('div');
    bgImage.className = 'background-image';

    // Create image element
    const img = document.createElement('img');
    img.className = 'cell-image';

    // Create text element
    const textSpan = document.createElement('span');
    textSpan.className = 'word-text';
    textSpan.textContent = topic.word;

    // Handle FREE space
    if (index === 12) {
        img.src = 'https://cdn.pixabay.com/photo/2013/07/12/17/39/star-152151_150.png';
        img.alt = 'FREE';
        img.className = 'cell-image free-space-image';
        bgImage.appendChild(img);

        cell.classList.add('free-space');
        cell.classList.remove('loading');
        cell.classList.add('marked');

        const checkMark = document.createElement('span');
        checkMark.className = 'check-mark';
        checkMark.innerHTML = '✔';
        cell.appendChild(checkMark);
    } else {
        // Load image for regular cells
        getImageUrlFromDescription(topic.imageDescription)
            .then(imageUrl => {
                if (imageUrl) {
                    img.src = imageUrl;
                    img.alt = topic.word;
                    bgImage.appendChild(img);
                }
                cell.classList.remove('loading');
            })
            .catch(error => {
                console.error('Error loading image:', error);
                cell.classList.remove('loading');
            });
    }

    // Add click handler
    cell.addEventListener('click', () => handleCellClick(cell));

    // Assemble cell
    cell.appendChild(bgImage);
    cell.appendChild(textSpan);

    return cell;
}
