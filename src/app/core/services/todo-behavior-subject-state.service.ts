import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodoService } from '../services/todo.service';
import { Todo, TodoState, TodoStatusType } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class TodoBehaviorSubjectStateService {
  private todoService = inject(TodoService);

  // Initial state using BehaviorSubjects
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  private isTodosLoadingSubject = new BehaviorSubject<boolean>(false);
  private filterStatusSubject = new BehaviorSubject<TodoStatusType>('ALL');
  private filterTextSubject = new BehaviorSubject<string>('');

  // Exposed Observables
  todos$ = this.todosSubject.asObservable();
  isTodosLoading$ = this.isTodosLoadingSubject.asObservable();
  filterStatus$ = this.filterStatusSubject.asObservable();
  filterText$ = this.filterTextSubject.asObservable();

  // Computed Observables
  filteredTodos$: Observable<Todo[]> = combineLatest([
    this.todos$,
    this.filterStatus$,
    this.filterText$,
  ]).pipe(
    map(([todos, status, text]) => {
      const lowerText = text.toLowerCase();
      return todos.filter((todo) => {
        const matchesStatus =
          status === 'ALL' ||
          (status === 'COMPLETED' && todo.completed) ||
          (status === 'NOT_COMPLETED' && !todo.completed);
        const matchesText = todo.title.toLowerCase().includes(lowerText);
        return matchesStatus && matchesText;
      });
    })
  );

  filteredTodosCount$: Observable<number> = this.filteredTodos$.pipe(
    map((filteredTodos) => filteredTodos.length)
  );

  // Load todos on initialization
  constructor() {
    this.loadTodos();
  }

  // Methods to interact with the state
  loadTodos(): void {
    this.isTodosLoadingSubject.next(true);
    this.todoService.getTodos().subscribe((todos: Todo[]) => {
      this.todosSubject.next(todos);
      this.isTodosLoadingSubject.next(false);
    });
  }

  deleteTodo(todoId: number): void {
    this.todoService.deleteTodo(todoId).subscribe(() => {
      const currentTodos = this.todosSubject.getValue();
      const updatedTodos = currentTodos.filter((todo) => todo.id !== todoId);
      this.todosSubject.next(updatedTodos);
    });
  }

  setFilterStatus(newStatus: TodoStatusType): void {
    this.filterStatusSubject.next(newStatus);
  }

  setFilterText(newText: string): void {
    this.filterTextSubject.next(newText);
  }
}
