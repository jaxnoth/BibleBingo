// Initialize window.env if it doesn't exist
window.env = window.env || {};

// Function to fetch and set environment variables
async function initializeEnvironment() {
    try {
        // In production, fetch from Azure configuration
        const response = await fetch('/.auth/me');
        if (response.ok) {
            const data = await response.json();
            // Set environment variables from Azure configuration
            window.env.PIXABAY_API_KEY = data.clientPrincipal?.claims?.PIXABAY_API_KEY;
            window.env.GROQ_API_KEY = data.clientPrincipal?.claims?.GROQ_API_KEY;
        } else {
            console.log('Using local environment');
        }
    } catch (error) {
        console.log('Error fetching environment:', error);
    }
}

// Initialize environment when the script loads
initializeEnvironment();