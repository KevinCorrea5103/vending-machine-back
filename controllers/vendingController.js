let coins = 0;
const inventory = {
  coke: 5,
  pepsi: 5,
  sprite: 5,
};
const itemPrice = 2;

const insertCoin = (req, res) => {
  coins += 1;
  res.status(200).json({ coins });
};

const returnCoins = (req, res) => {
  const returnedCoins = coins;
  coins = 0;
  res.status(200).json({ returnedCoins });
};

const getInventory = (req, res) => {
  res.status(200).json(inventory);
};

const getItemInventory = (req, res) => {
  const { item } = req.params;
  if (inventory[item] === undefined) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.status(200).json({ [item]: inventory[item] });
};

const purchaseItem = (req, res) => {
  const { item } = req.params;
  if (inventory[item] === undefined) {
    return res.status(404).json({ error: 'Item not found' });
  }
  if (inventory[item] === 0) {
    const returnedCoins = coins;
    coins = 0;
    return res.status(200).json({ error: 'Item out of stock', returnedCoins });
  }
  if (coins < itemPrice) {
    const returnedCoins = coins;
    coins = 0;
    return res.status(200).json({ error: 'Insufficient funds', returnedCoins });
  }

  // Update inventory and return the response
  inventory[item] -= 1;
  const returnedCoins = coins - itemPrice;
  coins = 0;
  res.status(200).json({ item, inventory: inventory[item], returnedCoins });
};

module.exports = {
  insertCoin,
  returnCoins,
  getInventory,
  getItemInventory,
  purchaseItem,
};
