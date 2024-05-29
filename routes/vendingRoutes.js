const express = require('express');
const {
  insertCoin,
  returnCoins,
  getInventory,
  getItemInventory,
  purchaseItem,
} = require('../controllers/vendingController');

const router = express.Router();

router.post('/insert-coin', insertCoin);
router.post('/return-coins', returnCoins);
router.get('/inventory', getInventory);
router.get('/inventory/:item', getItemInventory);
router.post('/purchase/:item', purchaseItem);

module.exports = router;
