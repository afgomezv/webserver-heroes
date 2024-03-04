import { Request, Response } from "express";

const todos = [
  { id: 1, content: "Buy milk", completedAt: new Date() },
  { id: 2, content: "Buy bread", completedAt: null },
  { id: 3, content: "Buy butter", completedAt: new Date() },
];

export class TodoController {
  //* DI
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: `ID argument is not a number` });
    const todo = todos.find((todo) => todo.id === id);

    todo
      ? res.json(todo)
      : res.status(404).json({ error: `TODO with id ${id} not found` });
  };

  public createTodo = (req: Request, res: Response) => {
    const { content } = req.body;
    console.log(content);

    if (!content)
      return res.status(400).json({ error: "Content field is required" });

    const newTodo = {
      id: todos.length + 1,
      content: content,
      completedAt: null,
    };

    todos.push(newTodo);

    res.json(newTodo);
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id))
      return res.status(400).json({ error: `ID argument is not a number` });

    const todo = todos.find((todo) => todo.id === id);
    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found ` });

    const { content, completedAt } = req.body;
    // if (!content)
    //   return res.status(400).json({ error: "Content field is required" });

    todo.content = content || todo.content;
    completedAt === "null"
      ? (todo.completedAt = null)
      : (todo.completedAt = new Date(completedAt || todo.completedAt));

    //! OJO, referencia
    // todos.forEach((todo, index) => {
    //   if (todo.id === id) {
    //     todos[index] = todo;
    //   }
    // });

    res.json(todo);
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = +req.params.id;

    const todo = todos.find((todo) => todo.id === id);
    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found` });

    todos.splice(todos.indexOf(todo), 1);
    res.json(todo);
  };
}
