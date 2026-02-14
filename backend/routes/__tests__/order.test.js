const request = require('supertest');
const express = require('express');
const orderRouter = require('../orderRoutes');
const { supabase } = require('../../supabaseClient');

// Corrected jest.mock spelling
jest.mock('../../supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use('/api/order', orderRouter);

describe('Order API (happy path)', () => {
  it('should create a new order successfully', async () => {
    const newOrder = { user_id: 1, total_amount: 100.0 };
    const mockResponse = [{ id: 1, ...newOrder }];

    // Mock supabase.from().insert()
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ data: mockResponse, error: null }),
    });

    const res = await request(app).post('/api/order').send(newOrder);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Order created', order: mockResponse[0] });
  });
});
