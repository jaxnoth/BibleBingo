const config = {
    GROQ_API_KEY: window.ENV_GROQ_API_KEY || 'development-key',
    PIXABAY_API_KEY: window.ENV_PIXABAY_API_KEY || 'development-key',
    isProduction: window.ENV_GROQ_API_KEY !== undefined
};