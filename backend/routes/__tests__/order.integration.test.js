const request = require('supertest');
const app = require('../../app');
const { supabase } = require('../../supabaseClient');

describe('Order API (happy paths)', () => {
    beforeEach(async () => {
        await supabase.from('orders').delete().eq('user_id', 'test-user-123');
    });

    it('should create a new order in the Supabase orders table', async () => {
        const newOrder = {
            user_id: 'test-user-123',
            total_amount: 100.00,
        };

        const res = await request(app).post('/api/order').send(newOrder);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Order created');

        const dbCheck = await request(app).get('/api/order/test-user-123');

        expect(dbCheck.statusCode).toEqual(200);
        expect(Array.isArray(dbCheck.body)).toBe(true);
        expect(dbCheck.body.length).toBeGreaterThan(0);
        expect(dbCheck.body[0].user_id).toEqual('test-user-123');
    });

    it('should not create an order with a negative total amount', async () => {
        const newOrder = {
            user_id: 'test-user-123',
            total_amount: -50.00,
        };  

        const res = await request(app).post('/api/order').send(newOrder);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('Total amount should not be negative.');

        const dbCheck = await request(app).get('/api/order/test-user-123');

        expect(dbCheck.statusCode).toEqual(200);
        expect(Array.isArray(dbCheck.body)).toBe(true);
        expect(dbCheck.body.length).toEqual(0);
    });
});