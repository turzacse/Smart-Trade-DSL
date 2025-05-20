const express = require('express');
const dotenv = require('dotenv');
const smartTradeRoutes = require('./routes/smartTrade');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/smart-trade', smartTradeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
