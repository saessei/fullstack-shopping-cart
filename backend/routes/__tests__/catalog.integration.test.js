const request = require("supertest");
const app = require("../../app");
const { supabase } = require("../../supabaseClient");
const { clearDatabase } = require("../utils/db");

describe("Catalog API tests", () => {
  beforeAll(async () => {
    await clearDatabase('products');
    await supabase.from("products").insert([
      { id: 1, name: "Apple iPhone 8 Plus", price: 700 },
      { id: 2, name: "Apple iPhone X", price: 950 },
    ]);
  });

  afterAll(async () => {
    await clearDatabase('products');
  });

  it("GET /api/products should return real data from the database in order", async () => {
    const res = await request(app).get("/api/products");

    console.log("Database contains:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].id).toBe(1); 
    expect(res.body[1].id).toBe(2);
  });
});
