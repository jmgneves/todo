import { computed, inject } from '@angular/core';
import { TodoService } from './core/services/todo.service';
import {
  signalStore,
  withState,
  withMethods,
  withHooks,
  patchState,
  withComputed,
} from '@ngrx/signals';
import { Todo, TodoState, TodoStatusType } from './core/models/models';

const initialState: TodoState = {
  todos: [],
  filterStatus: 'ALL',
  filterText: '',
  createdTodo: null,
  updatedTodo: null,
  deletedTodo: null,
};

export const todoStore = signalStore(
  withState<TodoState>(initialState),
  withComputed((store) => ({
    filteredTodosCount: computed(() => store.todos().length),
    filteredTodos: computed(() => {
      const filterStatus = store.filterStatus();
      const filterText = store.filterText().toLowerCase();
      return store.todos().filter((todo) => {
        const matchesStatus =
          filterStatus === 'ALL' ||
          (filterStatus === 'COMPLETED' && todo.completed) ||
          (filterStatus === 'NOT_COMPLETED' && !todo.completed);
        const matchesText = todo.title.toLowerCase().includes(filterText);
        return matchesStatus && matchesText;
      });
    }),
  })),
  withMethods((store, todoService = inject(TodoService)) => ({
    loadTodos: (): void => {
      todoService.getTodos().subscribe((todos: Todo[]) => {
        patchState(store, (currentState: TodoState) => ({
          ...currentState,
          todos: todos,
          filteredTodos: todos,
          filterStatus: 'ALL' as 'ALL',
          filterText: '',
        }));
      });
    },
    addTodo: (todos: Todo[]): void => {
      patchState(store, (currentState: TodoState) => ({
        ...currentState,
        todos: todos,
        filteredTodos: todos,
      }));
    },
    updateTodo: (updatedTodo: Todo) => {
      todoService
        .updateTodo(updatedTodo.id, updatedTodo)
        .subscribe((todo: Todo) => {
          patchState(store, (currentState: TodoState) => ({
            ...currentState,
            todos: currentState.todos.map((t) => (t.id === todo.id ? todo : t)),
            updatedTodo: todo,
          }));
        });
    },
    deleteTodo: (todoId: number) => {
      todoService.deleteTodo(todoId).subscribe(() => {
        patchState(store, (currentState: TodoState) => ({
          ...currentState,
          todos: currentState.todos.filter((todo: Todo) => todo.id !== todoId),
          deletedTodo:
            currentState.todos.find((todo) => todo.id === todoId) || null,
        }));
      });
    },
    setFilterStatus(newValue: TodoStatusType) {
      patchState(store, (currentState: TodoState) => ({
        ...currentState,
        filterStatus: newValue,
      }));
    },
    setFilterText(newValue: string) {
      patchState(store, (currentState: TodoState) => ({
        ...currentState,
        filterText: newValue,
      }));
    },
  })),
  withHooks({
    onInit(store) {
      store.loadTodos();
    },
  })
);
