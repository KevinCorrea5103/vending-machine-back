const request = require('supertest');
const app = require('../app');

describe('Vending Machine API', () => {
  beforeEach(() => {
    // Reset coins and inventory before each test
    const controller = require('../controllers/vendingController');
    controller.coins = 0;
    controller.inventory.coke = 5;
    controller.inventory.pepsi = 5;
    controller.inventory.sprite = 5;
  });

  test('should insert a coin', async () => {
    const res = await request(app).post('/api/v1/vending/insert-coin');
    expect(res.status).toBe(200);
    expect(res.body.coins).toBe(1);
  });

  test('should return all coins', async () => {
    await request(app).post('/api/v1/vending/insert-coin');
    const res = await request(app).post('/api/v1/vending/return-coins');
    expect(res.status).toBe(200);
    expect(res.body.returnedCoins).toBe(1);
  });

  test('should get inventory', async () => {
    const res = await request(app).get('/api/v1/vending/inventory');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      coke: 5,
      pepsi: 5,
      sprite: 5,
    });
  });

  test('should get item inventory', async () => {
    const res = await request(app).get('/api/v1/vending/inventory/coke');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ coke: 5 });
  });

  test('should purchase an item', async () => {
    await request(app).post('/api/v1/vending/insert-coin');
    await request(app).post('/api/v1/vending/insert-coin');
    const res = await request(app).post('/api/v1/vending/purchase/coke');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      item: 'coke',
      inventory: 4,
      returnedCoins: 0,
    });
  });

  test('should fail to purchase if out of stock', async () => {
    const controller = require('../controllers/vendingController');
    controller.inventory.coke = 0;
    await request(app).post('/api/v1/vending/insert-coin');
    await request(app).post('/api/v1/vending/insert-coin');
    const res = await request(app).post('/api/v1/vending/purchase/coke');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      error: 'Item out of stock',
      returnedCoins: 2,
    });
  });

  test('should fail to purchase if insufficient funds', async () => {
    await request(app).post('/api/v1/vending/insert-coin');
    const res = await request(app).post('/api/v1/vending/purchase/coke');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      error: 'Insufficient funds',
      returnedCoins: 1,
    });
  });
});
