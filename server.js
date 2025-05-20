
// const express = require('express');
// const axios = require('axios');
// const crypto = require('crypto');
// require('dotenv').config();

// const app = express();
// const PORT = 5000;

// app.use(express.json());

// app.post('/create-smarttrade', async (req, res) => {
//   const payload = JSON.stringify(req.body);

//   const signature = crypto
//     .createHmac('sha256', process.env.API_SECRET)
//     .update(payload)
//     .digest('hex');

//   try {
//     const response = await axios.post(
//       'https://api.3commas.io/public/api/v2/smart_trades',
//       req.body,
//       {
//         headers: {
//           'APIKEY': process.env.API_KEY,
//           'Signature': signature,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     res.status(201).json(response.data);
//   } catch (error) {
//     console.error(error.response?.data || error.message);
//     res.status(error.response?.status || 500).json(error.response?.data || { message: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });




// const express = require('express');
// const axios = require('axios');
// const crypto = require('crypto');
// require('dotenv').config();

// const app = express();
// const PORT = 5000;

// // Capture raw body for signature
// app.use(express.json({
//   verify: (req, res, buf) => {
//     req.rawBody = buf.toString('utf8');
//   }
// }));

// app.post('/create-smarttrade', async (req, res) => {
//   const rawBody = req.rawBody;

//   const signature = crypto
//     .createHmac('sha256', process.env.API_SECRET)
//     .update(rawBody)
//     .digest('hex');

//   console.log('RawBody:', rawBody);
//   console.log('Signature:', signature);

//   try {
//     const response = await axios.post(
//       'https://api.3commas.io/public/api/v2/smart_trades',
//       JSON.parse(rawBody),
//       {
//         headers: {
//           'APIKEY': process.env.API_KEY,
//           'Signature': signature,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error(error.response?.data || error.message);
//     res.status(error.response?.status || 500).json(error.response?.data || { message: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });





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

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
