import { Signal } from '@angular/core';

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
export type TodoStatusType = 'ALL' | 'COMPLETED' | 'NOT_COMPLETED';

export interface TodoState {
  todos: Todo[];
  isTodosLoading: boolean;
  filterStatus: TodoStatusType;
  filterText: string;
  deletedTodo: Todo | null;
}

export type TodoStoreType = {
  todos: Signal<Todo[]>;
  filterStatus: Signal<TodoStatusType>;
  filterText: Signal<string>;
  filteredTodos: Signal<Todo[]>;
  allTodos: Signal<Todo[]>;
  currentFilterStatus: Signal<TodoStatusType>;
  currentFilterText: Signal<string>;
  setTodos: (todos: Todo[]) => void;
  setFilterStatus: (filterStatus: TodoStatusType) => void;
  setFilterText: (filterText: string) => void;
};
