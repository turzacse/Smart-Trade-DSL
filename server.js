const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString('utf8');
  }
}));

app.post('/create-smarttrade', async (req, res) => {
  const path = '/public/api/v2/smart_trades';
  const rawBody = req.rawBody;

  const parsedBody = JSON.parse(rawBody);
  const stringifiedBody = JSON.stringify(parsedBody); // ensures consistent format

  const signaturePayload = path + stringifiedBody;

  const signature = crypto
    .createHmac('sha256', process.env.API_SECRET)
    .update(signaturePayload)
    .digest('hex');

  console.log('➡️ Signature Payload:', signaturePayload);
  console.log('🔐 Signature:', signature);

  try {
    const response = await axios.post(
      `https://api.3commas.io${path}`,
      parsedBody,
      {
        headers: {
          'APIKEY': process.env.API_KEY,
          'Signature': signature,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('❌ API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: error.message });
  }
});


app.get('/my-accounts', async (req, res) => {
  try {
    const path = '/public/api/ver1/accounts';

    // v1 endpoint: only use path for signature
    const signature = crypto
      .createHmac('sha256', process.env.API_SECRET)
      .update(path)
      .digest('hex');

    const response = await axios.get(`https://api.3commas.io${path}`, {
      headers: {
        'APIKEY': process.env.API_KEY,
        'Signature': signature
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching accounts:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
