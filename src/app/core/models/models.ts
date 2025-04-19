import { Signal } from '@angular/core';
import { Subject } from 'rxjs';

export type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};
// export type TodoStore2 = {
//   // Signals for state
//   todos: () => Todo[];
//   isTodosLoading: () => boolean;
//   filterStatus: () => TodoStatusType;
//   filterText: () => string;
//   deletedTodo: () => Todo | null;
//   // Computed signals
//   filteredTodos: () => Todo[];
//   filteredTodosCount: () => number;
//   // Methods
//   loadTodos: () => void;
//   deleteTodo: (todoId: number) => void;
//   setFilterStatus: (status: TodoStatusType) => void;
//   setFilterText: (text: string) => void;
//   // Hook related (if needed)
//   destroySubject: () => Subject<void>;
// };
export type TodoStatusType = 'ALL' | 'COMPLETED' | 'NOT_COMPLETED';

export type TodoState = {
  todos: Todo[];
  isTodosLoading: boolean;
  filterStatus: TodoStatusType;
  filterText: string;
  deletedTodo: Todo | null;
};

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
