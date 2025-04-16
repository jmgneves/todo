import { computed, inject } from '@angular/core';
import { TodoService } from '../services/todo.service';
import {
  signalStore,
  withState,
  withMethods,
  withHooks,
  patchState,
  withComputed,
} from '@ngrx/signals';
import { Todo, TodoState, TodoStatusType } from '../models/models';

const initialState: TodoState = {
  todos: [],
  isTodosLoading: false,
  filterStatus: 'ALL',
  filterText: '',
  createdTodo: null,
  updatedTodo: null,
  deletedTodo: null,
};

const filterTodos = (
  todos: Todo[],
  filterStatus: TodoStatusType,
  filterText: string
): Todo[] => {
  return todos.filter((todo) => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'COMPLETED' && todo.completed) ||
      (filterStatus === 'NOT_COMPLETED' && !todo.completed);
    const matchesText = todo.title
      .toLowerCase()
      .includes(filterText.toLowerCase());
    return matchesStatus && matchesText;
  });
};

export const todoStore = signalStore(
  withState<TodoState>(initialState),
  withComputed((store) => ({
    filteredTodos: computed(() => {
      const filterStatus = store.filterStatus();
      const filterText = store.filterText().toLowerCase();
      return filterTodos(store.todos(), filterStatus, filterText);
    }),
    filteredTodosCount: computed(() => {
      const filterStatus = store.filterStatus();
      const filterText = store.filterText().toLowerCase();
      return filterTodos(store.todos(), filterStatus, filterText).length;
    }),
  })),
  withMethods((store, todoService = inject(TodoService)) => ({
    loadTodos: (): void => {
      patchState(store, { isTodosLoading: true });
      todoService.getTodos().subscribe((todos: Todo[]) => {
        patchState(store, (currentState: TodoState) => ({
          ...currentState,
          todos: todos,
          filteredTodos: todos,
          filterStatus: 'ALL' as 'ALL',
          filterText: '',
          isTodosLoading: false,
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
