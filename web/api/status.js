const axios = require('axios');

module.exports = async function (context, req) {
    try {
        // Get API keys from environment variables
        const groqApiKey = process.env.GROQ_API_KEY;
        const pixabayApiKey = process.env.PIXABAY_API_KEY;

        if (!groqApiKey || !pixabayApiKey) {
            context.res = {
                status: 500,
                body: { error: "API keys not configured" }
            };
            return;
        }

        // Test GROQ API
        const groqResult = await testGroqAPI(groqApiKey);

        // Test Pixabay API
        const pixabayResult = await testPixabayAPI(pixabayApiKey);

        context.res = {
            status: 200,
            body: {
                groq: groqResult,
                pixabay: pixabayResult,
                timestamp: new Date().toISOString()
            }
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: { error: error.message }
        };
    }
};

async function testGroqAPI(apiKey) {
    try {
        const startTime = Date.now();
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: 'Hello' }],
                temperature: 0.7,
                max_tokens: 100
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        const responseTime = Date.now() - startTime;

        return {
            status: 'success',
            responseTime: `${responseTime}ms`,
            statusCode: response.status,
        };
    } catch (error) {
        const errorDetails = error.response?.data?.error?.message || error.message;
        return {
            status: 'error',
            error: errorDetails,
            statusCode: error.response?.status || 'N/A',
            responseTime: 'N/A'
        };
    }
}

async function testPixabayAPI(apiKey) {
    try {
        const startTime = Date.now();
        const response = await axios.get(
            `https://pixabay.com/api/?key=${apiKey}&q=test&image_type=photo&per_page=3`
        );
        const responseTime = Date.now() - startTime;

        // Check if the response contains valid data
        if (response.status === 200 && response.data.totalHits >= 0) {
            return {
                status: 'success',
                responseTime: `${responseTime}ms`,
                statusCode: response.status,
            };
        } else {
            return {
                status: 'error',
                error: 'No results found',
                statusCode: response.status,
                responseTime: `${responseTime}ms`
            };
        }
    } catch (error) {
        const errorDetails = error.response?.data?.error || error.message;
        return {
            status: 'error',
            error: errorDetails,
            statusCode: error.response?.status || 'N/A',
            responseTime: 'N/A'
        };
    }
}