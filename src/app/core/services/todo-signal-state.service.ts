import { Injectable, signal, computed, inject } from '@angular/core';
import { TodoService } from './todo.service';
import { Todo, TodoState, TodoStatusType } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class TodoSignalStateService {
  private todoService = inject(TodoService);

  // Initial state
  todos = signal<Todo[]>([]);
  isTodosLoading = signal(false);
  filterStatus = signal<TodoStatusType>('ALL');
  filterText = signal('');

  // Computed signals
  readonly filteredTodos = computed(() => {
    const status = this.filterStatus();
    const text = this.filterText().toLowerCase();
    return this.todos().filter((todo) => {
      const matchesStatus =
        status === 'ALL' ||
        (status === 'COMPLETED' && todo.completed) ||
        (status === 'NOT_COMPLETED' && !todo.completed);
      const matchesText = todo.title.toLowerCase().includes(text);
      return matchesStatus && matchesText;
    });
  });

  readonly filteredTodosCount = computed(() => this.filteredTodos().length);

  // Load todos on initialization
  constructor() {
    this.loadTodos();
  }

  // Methods to interact with the state
  loadTodos(): void {
    this.isTodosLoading.set(true);
    this.todoService.getTodos().subscribe((todos: Todo[]) => {
      this.todos.set(todos);
      this.isTodosLoading.set(false);
    });
  }

  deleteTodo(todoId: number): void {
    this.todoService.deleteTodo(todoId).subscribe(() => {
      this.todos.update((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== todoId)
      );
    });
  }

  setFilterStatus(newStatus: TodoStatusType): void {
    this.filterStatus.set(newStatus);
  }

  setFilterText(newText: string): void {
    this.filterText.set(newText);
  }
}
