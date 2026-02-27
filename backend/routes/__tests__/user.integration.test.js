const request = require("supertest");
const app = require("../../app");
const { supabase } = require("../../supabaseClient");

// Mock Supabase client
jest.mock("../../supabaseClient", () => {
  const mockChain = () => ({
    select: jest.fn().mockResolvedValue({
      data: [{ id: 1, username: "testuser", email: "test@example.com" }],
      error: null
    }),
    insert: jest.fn().mockResolvedValue({
      data: [{ id: 1, username: "testuser", email: "test@example.com" }],
      error: null
    }),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockResolvedValue({ data: null, error: null })
  });

  return {
    supabase: {
      from: jest.fn().mockReturnValue(mockChain()),
      auth: {
        signUp: jest.fn().mockResolvedValue({
          data: { user: { id: 1 } },
          error: null
        }),
        signInWithPassword: jest.fn().mockResolvedValue({
          data: { session: {} },
          error: null
        }),
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 1 } },
          error: null
        })
      }
    }
  };
});

// Users API tests
describe("Users API (happy paths)", () => {
  beforeEach(async () => {
    // Database cleanup skipped since Supabase is mocked
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
//comment#2
//comment#3
