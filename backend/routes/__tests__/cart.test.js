const request = require("supertest");
const express = require("express");
const cartRouter = require("../cartRoutes"); 
const { supabase } = require("../../supabaseClient");

jest.mock("../../supabaseClient", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use("/api/cart", cartRouter);

describe("Shopping Cart API (happy paths)", () => {
  it("should add a new item to the cart", async () => {
    const newItem = { user_id: 1, product_id: 101, quantity: 2 };
    const mockResponse = [{ id: 1, ...newItem }];

    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ data: mockResponse, error: null }),
    });

    const res = await request(app).post("/api/cart").send(newItem);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: "Item added", cart: mockResponse[0] });
  });

});

describe("Shopping Cart API (sad path)", () => {
  it("should not input a negative quanity number", async () => {
    const newItem = { user_id: 1, product_id: 101, quantity: -2};
    const mockResponse = {message: "Quantity should not be negative."};

    const res = await request(app).post("/api/cart").send(newItem);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse)
  });
});