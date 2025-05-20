const axios = require('axios');
const dotenv = require('dotenv');
const signRequest = require('../utils/signRequest');
dotenv.config();

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
// Use the PRIVATE API base URL, not public
const BASE_URL = 'https://api.3commas.io/public/api';

async function createSmartTrade(tradeData) {
    const path = '/v2/smart_trades';
    const timestamp = Date.now(); // milliseconds since epoch

    // Query string with timestamp (no extra spaces)
    const queryString = `?timestamp=${timestamp}`;

    // Build the signature payload string exactly as required
    // path + query string + JSON string of body
    const bodyString = JSON.stringify(tradeData);
    const signaturePayload = `${path}${queryString}${bodyString}`;

    const signature = signRequest(signaturePayload, API_SECRET);

    const headers = {
        'APIKEY': API_KEY,
        'Signature': "fXNriRCvzfdMvNDg+3/XT2emrzoMem6jNA7XRu9N43w=", // signature,
        'Content-Type': 'application/json',
    };

    try {
        const url = `${BASE_URL}${path}${queryString}`;
        // Pass the tradeData as an object (axios will stringify)
        const response = await axios.post(url, tradeData, { headers });
        console.log('Response:', response);
        return response.data;
    } catch (error) {
        console.error('Trade Creation Failed:', error.response?.data || error.message);
        console.error('Error Details:', error);
        throw error.response ? error.response.data : error;
    }
}

module.exports = { createSmartTrade };

