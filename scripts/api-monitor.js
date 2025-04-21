const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load environment variables
const envPath = path.join(__dirname, '..', 'env.js');
let env;
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    // Extract the window.env object content
    const envMatch = envContent.match(/window\.env\s*=\s*({[\s\S]*?});/);
    if (envMatch) {
        env = JSON.parse(envMatch[1].replace(/'/g, '"'));
    } else {
        throw new Error('Could not parse env.js');
    }
} catch (error) {
    console.error('Error loading environment variables:', error.message);
    process.exit(1);
}

// Test GROQ API
async function testGroqAPI() {
    try {
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
                    'Authorization': `Bearer ${env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return {
            status: 'success',
            responseTime: response.headers['x-response-time'] || 'N/A',
            statusCode: response.status,
        };
    } catch (error) {
        const errorDetails = error.response?.data?.error?.message || error.message;
        return {
            status: 'error',
            error: errorDetails,
            statusCode: error.response?.status || 'N/A',
        };
    }
}

// Test Pixabay API
async function testPixabayAPI() {
    try {
        const response = await axios.get(
            `https://pixabay.com/api/?key=${env.PIXABAY_API_KEY}&q=test&image_type=photo&per_page=3`
        );

        // Check if the response contains valid data
        if (response.status === 200 && response.data.totalHits >= 0) {
            return {
                status: 'success',
                responseTime: response.headers['x-response-time'] || 'N/A',
                statusCode: response.status,
            };
        } else {
            return {
                status: 'error',
                error: 'No results found',
                statusCode: response.status,
            };
        }
    } catch (error) {
        const errorDetails = error.response?.data?.error || error.message;
        return {
            status: 'error',
            error: errorDetails,
            statusCode: error.response?.status || 'N/A',
        };
    }
}

// Run tests and display results
async function runTests() {
    console.log('Starting API monitoring tests...\n');

    console.log('Testing GROQ API...');
    const groqResult = await testGroqAPI();
    console.log('GROQ API Status:', groqResult.status);
    console.log('Response Time:', groqResult.responseTime);
    console.log('Status Code:', groqResult.statusCode);
    if (groqResult.error) console.log('Error:', groqResult.error);
    console.log('\n');

    console.log('Testing Pixabay API...');
    const pixabayResult = await testPixabayAPI();
    console.log('Pixabay API Status:', pixabayResult.status);
    console.log('Response Time:', pixabayResult.responseTime);
    console.log('Status Code:', pixabayResult.statusCode);
    if (pixabayResult.error) console.log('Error:', pixabayResult.error);
}

runTests();