// const express = require('express');
// const router = express.Router();
// const { createSmartTrade } = require('../services/threeCommas');

// // Sample endpoint
// router.post('/create', async (req, res) => {
//   const trade = req.body;

//   try {
//     const result = await createSmartTrade(trade);
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: err.message || 'Failed to create trade' });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const { createSmartTrade } = require('../services/threeCommas');

router.post('/create', async (req, res) => {
  const trade = req.body;

  try {
    const result = await createSmartTrade(trade);
    res.json(result);
  } catch (err) {
    // err may be an object with error and error_description
    if (typeof err === 'object' && err.error) {
      res.status(400).json(err);
    } else {
      res.status(500).json({ error: err.message || 'Failed to create trade' });
    }
  }
});

module.exports = router;
