interface TodoList {id: string;}

interface TodoLists {
    todoLists: TodoList[],
    total: number,
    skip: number,
    limit: number,
}

interface TodoList {
    id: string;
    name: string;
}

interface Todos {
    todos: Todo[],
    total: number,
    skip: number,
    limit: number,
}

interface Todo {
    id: string;
    text: string;
    status: string;
    isCompleted: boolean;
    listId: number;
}

type TodosResponse = {
    data: Todos;
    isLoading: boolean;
    isError: boolean;
    mutate: any;
    list: TodoList;
}

export type {TodoList, Todos, Todo, TodosResponse};