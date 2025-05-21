const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config(); // 

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const BASE_URL = 'https://api.3commas.io/public/api';
console.log('API_KEY:', API_KEY);
console.log('API_SECRET:', API_SECRET);


router.post('/create', async (req, res) => {
  try {
    const path = '/v2/smart_trades';
    const url = BASE_URL + path;
    const timestamp = Date.now().toString();

    const body = req.body;
    const rawBody = JSON.stringify(body);

    // ✅ Log all required values for debugging
    console.log('Signing values:');
    console.log('PATH:', path);
    console.log('TIMESTAMP:', timestamp);
    console.log('RAW BODY:', rawBody);
    console.log('SECRET:', API_SECRET ? 'present' : 'MISSING');

    const message = path + timestamp + rawBody;

    const signature = crypto
      .createHmac('sha256', API_SECRET)
      .update(message)
      .digest('hex');

    const headers = {
      APIKEY: API_KEY,
      Signature: signature,
      Timestamp: timestamp,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(url, body, { headers });

    return res.json(response.data);
  } catch (error) {
    console.error('Smart Trade creation failed:', error.response?.data || error.message);
    return res.status(500).json({
      error: 'Smart Trade creation failed',
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;