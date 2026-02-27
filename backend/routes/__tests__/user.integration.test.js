const request = require("supertest");
const app = require("../../app");
const { supabase } = require("../../supabaseClient");



describe("Users API (happy paths)", () => {
  beforeEach(async () => {
    await supabase.from("users").delete().eq("email", "test@example.com");
  });

  it("POST /api/users should create a new user", async () => {
    const newUser = { username: "testuser", email: "test@example.com" };

    const res = await request(app).post("/api/users").send(newUser);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("User created");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user.username).toBe("testuser");
    expect(res.body.user.email).toBe("test@example.com");

    const dbCheck = await request(app).get("/api/users");
    expect(dbCheck.statusCode).toEqual(200);
    expect(Array.isArray(dbCheck.body)).toBe(true);
    const found = dbCheck.body.find(u => u.email === "test@example.com");
    expect(found).toBeDefined();
    expect(found.username).toBe("testuser");
  });

  it("POST /api/users should not create a user without an email", async () => {
    const newUser = { username: "testuser" };

    const res = await request(app).post("/api/users").send(newUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("Email is required.");
  });

  it("POST /api/users should not create a user without a username", async () => {
    const newUser = { email: "test@example.com" };

    const res = await request(app).post("/api/users").send(newUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("Username is required.");
  });
});
//comment
//comment
