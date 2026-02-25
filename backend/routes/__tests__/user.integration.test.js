const request = require("supertest");
const express = require("express");
const userRouter = require("../userRoutes");
const { supabase } = require("../../supabaseClient");

jest.mock("../../supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({
        data: [{ id: 1, username: "testuser", email: "test@example.com" }],
        error: null,
      }),
    })),
  },
}));

const app = express();
app.use(express.json());
app.use("/api/users", userRouter);

describe("Users API (happy paths)", () => {
  it("should create a new user", async () => {
    const newUser = { username: "testuser", email: "test@example.com" };
    const mockResponse = [{ id: 1, ...newUser }];

    const mockSelect = jest.fn().mockResolvedValue({
      data: mockResponse,
      error: null,
    });
    const mockInsert = jest.fn().mockReturnThis();

    supabase.from.mockReturnValue({
      insert: mockInsert,
      select: mockSelect,
    });

    const res = await request(app).post("/api/users").send(newUser);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: "User created", user: mockResponse[0] });
  });
});

describe("Users API (sad paths)", () => {
  it("should not create a user without an email", async () => {
    const newUser = { username: "testuser" };
    const mockResponse = { message: "Email is required." };

    const res = await request(app).post("/api/users").send(newUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse);
  });

  it("should not create a user without a username", async () => {
    const newUser = { email: "test@example.com" };
    const mockResponse = { message: "Username is required." };

    const res = await request(app).post("/api/users").send(newUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse);
  });

  it("should not allow duplicate email addresses", async () => {
    const newUser = { username: "duplicateUser", email: "test@example.com" };
    const mockResponse = { message: "Email already exists." };

    const mockSelect = jest.fn().mockResolvedValue({
      data: [{ id: 1, username: "testuser", email: "test@example.com" }],
      error: null,
    });

    supabase.from.mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      select: mockSelect,
    });

    const res = await request(app).post("/api/users").send(newUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(mockResponse);
  });
});