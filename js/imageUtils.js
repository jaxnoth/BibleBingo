// Initialize the cache at the top of the file
window.imageCache = new Map();

// Add a function to clear the cache
window.clearImageCache = function() {
    window.imageCache.clear();
    console.log('Image cache cleared');
};

async function getImageUrlFromDescription(description) {
    console.log('Getting image for:', description);

    try {
        // Clean up the description
        const searchTerm = description.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .trim();

        // Check cache first
        if (window.imageCache.has(searchTerm)) {
            console.log('Cache hit for:', searchTerm);
            return window.imageCache.get(searchTerm);
        }

        // Get API key from env.js
        const apiKey = window.env?.PIXABAY_API_KEY;

        if (!apiKey) {
            console.error('Pixabay API key not found');
            return null;
        }

        console.log('Fetching from Pixabay:', searchTerm);
        const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(searchTerm)}&image_type=photo&orientation=horizontal&per_page=3&safesearch=true`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.hits && data.hits.length > 0) {
            const imageUrl = data.hits[0].webformatURL;
            // Store in cache
            window.imageCache.set(searchTerm, imageUrl);
            return imageUrl;
        }

        return null;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}