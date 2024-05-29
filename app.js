const express = require('express');
const vendingRoutes = require('./routes/vendingRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1/vending', vendingRoutes);

app.listen(port, () => {
  console.log(`Vending machine API running on port ${port}`);
});

module.exports = app;
