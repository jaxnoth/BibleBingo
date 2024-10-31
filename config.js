const config = {
    GROQ_API_KEY: window.ENV_GROQ_API_KEY || 'development-key',
    PIXABAY_API_KEY: window.ENV_PIXABAY_API_KEY || 'development-key',
    isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
};

// Verify config loaded
console.log('Config loaded:', {
    hasGroqKey: !!config.GROQ_API_KEY,
    hasPixabayKey: !!config.PIXABAY_API_KEY
});