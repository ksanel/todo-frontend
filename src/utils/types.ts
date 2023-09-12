interface TodoList {id: string;}

interface Todos {
    todos: Todo[],
    total: number,
    skip: number,
    limit: number,
}

interface Todo {
    id: string;
    todo: string;
    completed: boolean;
    userId: number;
}

type TodosResponse = {
    data: Todos;
    isLoading: boolean;
    isError: boolean;
    mutate: any;
}

export type {TodoList, Todos, Todo, TodosResponse};