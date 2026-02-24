const request = require("supertest");
const app = require("../../app");
const { supabase } = require("../../supabaseClient");
const { clearDatabase } = require("../utils/db");

describe("Catalog API tests", () => {

  beforeAll(async () => {
    await clearDatabase("products");

    const { error } = await supabase
      .from("products")
      .insert([
        { id: 1, name: "Apple iPhone 8 Plus", price: 700 },
        { id: 2, name: "Apple iPhone X", price: 950 },
      ])
      .select();

    if (error) {
      console.error("Supabase Insert Error:", error.message);
      throw new Error(`Setup failed: ${error.message}`);
    }
  });

  afterAll(async () => {
    await clearDatabase("products");
  });

  // happy path
  it("GET /api/products should return real data from the database in order", async () => {
    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].id).toBe(1);
    expect(res.body[1].id).toBe(2);
  });

  //sad path
  it("GET /api/products should return 500 if database returns an error", async () => {
    const originalFrom = supabase.from;

    supabase.from = () => ({
      select: () => ({
        order: async () => ({
          data: null,
          error: { message: "Database connection failed" },
        }),
      }),
    });

    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: "Database connection failed",
    });

    // Restore original function
    supabase.from = originalFrom;
  });

});