const request = require("supertest");
const app = require("../../app");
const { supabase } = require("../../supabaseClient");

describe("Shopping Cart API (happy paths)", () => {
  beforeEach(async () => { //makes sure the db is clean
    await supabase.from("carts").delete().eq("user_id", "test-user-123");
  });

  it("should save an item to the Supabase carts table", async () => {
    const newItem = {
      user_id: "test-user-123",
      product_id: 1,
      quantity: 2,
    };

    const res = await request(app).post("/api/cart").send(newItem);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Item added");

    const dbCheck = await request(app).get("/api/cart/test-user-123");

    expect(dbCheck.statusCode).toEqual(200);
    expect(Array.isArray(dbCheck.body)).toBe(true);
    expect(dbCheck.body.length).toBeGreaterThan(0);
    expect(dbCheck.body[0].user_id).toEqual("test-user-123");
  });
  

  it("should not save an item with a negative quantity", async () => {
    const newItem = {
      user_id: "test-user-123",
      product_id: 1,
      quantity: -1,
    };

    const res = await request(app).post("/api/cart").send(newItem);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("Quantity should not be negative.");

    const dbCheck = await request(app).get("/api/cart/test-user-123");

    expect(dbCheck.statusCode).toEqual(200); 
    expect(Array.isArray(dbCheck.body)).toBe(true);
    expect(dbCheck.body.length).toEqual(0); 
  });
});
