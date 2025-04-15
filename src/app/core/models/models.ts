import { Signal } from '@angular/core';

export interface Todo {
  userId: number; // ID of the user who owns the todo
  id: number; // Unique ID of the todo
  title: string; // Title or description of the todo
  completed: boolean; // Status of the todo (true if completed, false otherwise)
}
export type TodoStatusType = 'ALL' | 'COMPLETED' | 'NOT_COMPLETED'; // Type for filter status

export interface TodoState {
  todos: Todo[]; // List of todos
  filterStatus: TodoStatusType; // Current filter status
  filterText: string; // Text to filter todos by title
  createdTodo: Todo | null;
  updatedTodo: Todo | null;
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
