export class CreateTodoDto {
  private constructor(public readonly content: string) {}

  static create(props: { [key: string]: any }): [string?, CreateTodoDto?] {
    const { content } = props;

    if (!content) return ["Text property is required", undefined];

    return [undefined, new CreateTodoDto(content)];
  }
}
