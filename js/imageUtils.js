// Global variables for image handling
const imageCache = new Map();
const usedImages = new Set();

// Cache duration and retry settings
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

class ImageCache {
    constructor() {
        this.cache = new Map();
        this.loadFromStorage();
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('imageCache');
            if (stored) {
                const parsed = JSON.parse(stored);
                Object.entries(parsed).forEach(([key, entry]) => {
                    if (Date.now() - entry.timestamp < CACHE_DURATION) {
                        this.cache.set(key, entry.urls);
                    }
                });
            }
        } catch (error) {
            console.log('Failed to load image cache:', error);
        }
    }

    set(key, value) {
        const urls = this.cache.get(key) || [];
        if (!urls.includes(value)) {
            urls.push(value);
            this.cache.set(key, urls);
        }

        try {
            const cacheObject = {};
            this.cache.forEach((urls, key) => {
                cacheObject[key] = {
                    urls: urls,
                    timestamp: Date.now()
                };
            });
            localStorage.setItem('imageCache', JSON.stringify(cacheObject));
        } catch (error) {
            console.log('Failed to save image cache:', error);
        }
    }

    get(key) {
        const urls = this.cache.get(key);
        if (!urls || urls.length === 0) return null;

        const unusedUrls = urls.filter(url => !usedImages.has(url));
        if (unusedUrls.length === 0) return null;

        return unusedUrls[Math.floor(Math.random() * unusedUrls.length)];
    }

    has(key) {
        const urls = this.cache.get(key);
        if (!urls || urls.length === 0) return false;
        return urls.some(url => !usedImages.has(url));
    }

    clear() {
        this.cache.clear();
        localStorage.removeItem('imageCache');
    }
}

function resetUsedImages() {
    usedImages.clear();
}

function wordToSearchTerm(word) {
    const searchTermMap = {
        // Religious terms
        'pray': 'praying hands clipart',
        'faith': 'cross christian clipart',
        'jesus': 'jesus christ clipart',
        'god': 'divine light rays clipart',
        'bible': 'holy bible book clipart',
        'church': 'church building clipart',
        'cross': 'christian cross clipart',
        'angel': 'angel wings clipart',

        // Actions
        'love': 'heart symbol clipart',
        'sing': 'music note clipart',
        'help': 'helping hands clipart',
        'give': 'gift box clipart',
        'serve': 'serving hands clipart',

        // Objects
        'bread': 'bread loaf clipart',
        'water': 'water drop clipart',
        'light': 'sunlight rays clipart',
        'fish': 'christian fish symbol',
        'dove': 'white dove peace',
        'lamp': 'oil lamp ancient',
        'scroll': 'ancient scroll clipart',
        'crown': 'royal crown clipart',

        // Nature
        'tree': 'tree of life clipart',
        'star': 'bethlehem star clipart',
        'sun': 'sun rays clipart',
        'moon': 'crescent moon clipart',
        'garden': 'eden garden clipart',

        // Animals
        'lamb': 'lamb sheep clipart',
        'sheep': 'flock sheep clipart',
        'lion': 'lion judah clipart',

        // People
        'moses': 'moses staff clipart',
        'david': 'david sling clipart',
        'mary': 'virgin mary clipart',
        'paul': 'apostle paul clipart',
        'peter': 'apostle peter clipart',

        // Concepts
        'hope': 'anchor hope clipart',
        'peace': 'dove olive branch',
        'joy': 'celebration clipart',
        'grace': 'divine grace clipart',
        'holy': 'holy spirit dove',
        'trust': 'handshake trust clipart',
        'good': 'thumbs up clipart',
        'kind': 'helping heart clipart'
    }

    const upperWord = word.toUpperCase();
    return searchTermMap[upperWord] || `${word.toLowerCase()} christian`;
}


const wordLists = {
    actions: [
        'PRAY', 'SING', 'SERVE', 'GIVE', 'HELP', 'SHARE', 'LOVE', 'TRUST',
        'PRAISE', 'BLESS', 'WORSHIP', 'THANK'
    ],
    concepts: [
        'FAITH', 'HOPE', 'GRACE', 'PEACE', 'JOY', 'MERCY', 'GLORY', 'TRUTH',
        'HOLY', 'GOOD', 'SPIRIT', 'POWER'
    ],
    objects: [
        'CROSS', 'BIBLE', 'BREAD', 'WATER', 'LIGHT', 'CROWN', 'LAMB', 'DOVE',
        'FISH', 'SCROLL', 'TEMPLE', 'ALTAR'
    ],
    attributes: [
        'KIND', 'WISE', 'PURE', 'JUST', 'TRUE', 'MEEK', 'BOLD', 'CALM',
        'STRONG', 'GENTLE', 'HUMBLE', 'LOYAL'
    ]
};


const imageDescriptions = {
    'PRAY': 'pray',
    'CROSS': 'cross',
    'BIBLE': 'bible',
    'HEART': 'heart',
    'STAR': 'star',
    'ANGEL': 'angel',
    'CHURCH': 'church',
    'DOVE': 'dove',
    'FISH': 'fish',
    'CROWN': 'crown',
    'LIGHT': 'light',
    'WATER': 'water',
    'BREAD': 'bread',
    'LAMB': 'lamb',
    'SCROLL': 'scroll',
    'FAITH': 'cross',
    'HOPE': 'star',
    'LOVE': 'heart',
    'GRACE': 'dove',
    'PEACE': 'dove',
    'TRUTH': 'bible',
    'HOLY': 'cross',
    'GLORY': 'crown',
    'SPIRIT': 'dove',
    'WORSHIP': 'pray',
    'PRAISE': 'star',
    'TEMPLE': 'church',
    'POWER': 'light',
    'SERVE': 'pray',
    'GIVE': 'heart',
    'HELP': 'pray',
    'SHARE': 'bread',
    'TRUST': 'cross',
    'BLESS': 'star',
    'THANK': 'pray'
};
const descriptionMap = {
    'prayer': 'pray',
    'praying': 'pray',
    'hands in prayer': 'pray',
    'clasping hands': 'pray',
    'clasping hands in prayer': 'pray',
    'holy bible': 'bible',
    'scripture': 'bible',
    'holy cross': 'cross',
    'crucifix': 'cross',
    'holy spirit': 'dove',
    'peace dove': 'dove',
    'white dove': 'dove',
    'holy water': 'water',
    'bread of life': 'bread',
    'holy bread': 'bread',
    'scroll of scripture': 'scroll',
    'ancient scroll': 'scroll',
    'holy crown': 'crown',
    'royal crown': 'crown',
    'divine light': 'light',
    'holy light': 'light',
    'sacred heart': 'heart',
    'loving heart': 'heart',
    'guiding star': 'star',
    'bright star': 'star',
    'holy lamb': 'lamb',
    'lamb of god': 'lamb',
    'christian fish': 'fish',
    'jesus fish': 'fish',
    'ichthys': 'fish',
    'church building': 'church',
    'temple': 'church',
    'sanctuary': 'church',
    'holy angel': 'angel',
    'guardian angel': 'angel'
};

// Default fallbacks for common themes
const themeImageMap = {
    'worship': 'pray',
    'faith': 'cross',
    'hope': 'star',
    'love': 'heart',
    'spirit': 'dove',
    'truth': 'bible',
    'glory': 'crown',
    'praise': 'star'
};

/**
 * Normalize an image description to match available images
 * @param {string} description - The description to normalize
 * @returns {string} - The normalized description
 */
function normalizeDescription(desc) {
    desc = desc.toLowerCase();

    // Map complex descriptions to simple ones
    const descriptionMap = {
        'prayer': 'pray',
        'praying': 'pray',
        'hands in prayer': 'pray',
        'clasping hands': 'pray',
        'clasping hands in prayer': 'pray',
        'holy bible': 'bible',
        'scripture': 'bible',
        'holy cross': 'cross',
        'crucifix': 'cross',
        'holy spirit': 'dove',
        'peace dove': 'dove',
        'white dove': 'dove',
        'holy water': 'water',
        'bread of life': 'bread',
        'holy bread': 'bread',
        'scroll of scripture': 'scroll',
        'ancient scroll': 'scroll',
        'holy crown': 'crown',
        'royal crown': 'crown',
        'divine light': 'light',
        'holy light': 'light',
        'sacred heart': 'heart',
        'loving heart': 'heart',
        'guiding star': 'star',
        'bright star': 'star',
        'holy lamb': 'lamb',
        'lamb of god': 'lamb',
        'christian fish': 'fish',
        'jesus fish': 'fish',
        'ichthys': 'fish',
        'church building': 'church',
        'temple': 'church',
        'sanctuary': 'church',
        'holy angel': 'angel',
        'guardian angel': 'angel'
    };

    // Check for exact matches first
    if (descriptionMap[desc]) {
        return descriptionMap[desc];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(descriptionMap)) {
        if (desc.includes(key)) {
            return value;
        }
    }

    // Default fallbacks based on common words
    if (desc.includes('worship')) return 'pray';
    if (desc.includes('faith')) return 'cross';
    if (desc.includes('hope')) return 'star';
    if (desc.includes('love')) return 'heart';
    if (desc.includes('spirit')) return 'dove';
    if (desc.includes('truth')) return 'bible';
    if (desc.includes('glory')) return 'crown';
    if (desc.includes('praise')) return 'star';

    // Final fallback
    return 'cross';
}