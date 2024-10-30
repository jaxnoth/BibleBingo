// Configuration and Constants
const DEBUG = true;
const celebratedLines = new Set();

// Pixabay configuration
const PIXABAY_API_KEY = config.PIXABAY_API_KEY;
const PIXABAY_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_RETRIES = 3;

// Image configuration
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFE_SEARCH = true;

const fallbackWords = [
    'PRAY', 'FAITH', 'HOPE', 'LOVE', 'GRACE', 'PEACE',
    'LIGHT', 'TRUTH', 'JOY', 'HOLY', 'GLORY', 'CROSS',
    'BIBLE', 'HEART', 'STAR', 'DOVE', 'CROWN'
];
