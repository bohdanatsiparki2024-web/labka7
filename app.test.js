const request = require("supertest");
const app = require("./app");

describe("Library API Tests", () => {
  test("GET /books should return all books", async () => {
    const res = await request(app).get("/books");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("POST /loans should create a new loan record", async () => {
    const res = await request(app)
      .post("/loans")
      .send({ userId: 1, bookId: 1 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  test("GET /fines/:userId should return user fines", async () => {
    const res = await request(app).get("/fines/1");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
