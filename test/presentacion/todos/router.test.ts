import request from "supertest";
import { testServer } from "../../test-server";
import { prisma } from "../../../src/data/postgres";

describe("Todo router testing", () => {
  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(() => {
    testServer.close();
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  const todoOne = { content: "Hola mundo one" };
  const todoTwo = { content: "Hola mundo two" };

  test("should return TODOs api/todos ", async () => {
    await prisma.todo.createMany({
      data: [todoOne, todoTwo],
    });

    const { body } = await request(testServer.app)
      .get("/api/todos")
      .expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body.length).toEqual(2);
    expect(body[0].text).toBe(todoOne.content);
    expect(body[1].text).toBe(todoTwo.content);
    expect(body[0].completedAt).toBeNull();
  });

  test("should return TODOs api/todos/:id", async () => {
    const todo = await prisma.todo.create({ data: todoOne });

    const { body } = await request(testServer.app)
      .get(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todoOne.content,
      completedAt: todo.completedAt,
    });
  });

  test("should return a 404 not Found api/todos/:id ", async () => {
    const todoId = 1;

    const { body } = await request(testServer.app)
      .get(`/api/todos/${todoId}`)
      .expect(404);

    expect(body).toEqual({ message: `Todo with id ${todoId} not found` });
  });

  test("should return a new Todo api/todos", async () => {
    const { body } = await request(testServer.app)
      .post("/api/todos")
      .send(todoOne)
      .expect(201);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todoOne.content,
      completedAt: null,
    });
  });

  test("should return an error if content is not preset  api/todos", async () => {
    const { body } = await request(testServer.app)
      .post("/api/todos")
      .send({})
      .expect(400);

    expect(body).toEqual({ error: "Text property is required" });
  });

  test("should return an error if content is empty  api/todos", async () => {
    const { body } = await request(testServer.app)
      .post("/api/todos")
      .send({ content: "" })
      .expect(400);

    expect(body).toEqual({ error: "Text property is required" });
  });

  test("should return an updated TODO api/todos/:id", async () => {
    const todo = await prisma.todo.create({ data: todoTwo });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ content: "Content Updated", completedAt: "2024-03-11" })
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: "Content Updated",
      completedAt: "2024-03-11T00:00:00.000Z",
    });
  });

  // TODO: Realizar la operacion con errores personalizados
  test("should return 404 if TODO not found", async () => {
    const todoId = 1;

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todoId}`)
      .send({ text: "Content Updated", completedAt: "2024-03-11" })
      .expect(404);

    expect(body).toEqual({ message: `Todo with id ${todoId} not found` });
  });

  test("should return an updated TODO only date", async () => {
    const todo = await prisma.todo.create({ data: todoTwo });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ completedAt: "2024-03-11" })
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo.content,
      completedAt: "2024-03-11T00:00:00.000Z",
    });
  });

  test("should deleted a TODO api/todos/:id", async () => {
    const todo = await prisma.todo.create({ data: todoTwo });

    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo.content,
      completedAt: todo.completedAt,
    });
  });

  // test("should return 404 if todo not exists api/todos/:id", async () => {
  //   const todoId = 1;

  //   const { body } = await request(testServer.app)
  //     .delete(`/api/todos/${todoId}`)
  //     .expect(404);

  //   expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
  // });
});
