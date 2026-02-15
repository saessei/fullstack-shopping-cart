const request = require("supertest");
const express = require("express");
const catalogRouter = require("../catalogRoutes");
const { supabase } = require("../../supabaseClient");

jest.mock("../../supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      order: jest.fn(),
    })),
  },
}));

const app = express();
app.use(express.json());
app.use("/api/products", catalogRouter);

describe("Catalog API (happy paths)", () => {
  it("should return the list of products ordered by id", async () => {
    const mockProducts = [
      { id: 1, name: "Apple iPhone 8 Plus", price: 700 },
      { id: 2, name: "Apple iPhone X", price: 950 },
    ];

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockProducts, error: null }),
    });

    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockProducts);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("Catalog API (sad path)", () => {
  it("should return 500 if database query fails", async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: null,
        error: { message: "Database connection failed" },
      }),
    });

    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({error: "Database connection failed"})
  });
});
