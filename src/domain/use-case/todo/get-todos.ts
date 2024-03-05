import { TodoEntity } from "../../entities/todo.entity";
import { TodoRepository } from "../../repositories/todo.repository";

export interface GetAllTodoUseCase {
  execute(id: number): Promise<TodoEntity[]>;
}

export class GetAllTodo implements GetAllTodoUseCase {
  constructor(private readonly repository: TodoRepository) {}

  execute(): Promise<TodoEntity[]> {
    return this.repository.getAll();
  }
}
