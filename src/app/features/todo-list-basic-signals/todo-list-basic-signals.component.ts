import {
  Component,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TodoService } from '../../core/services/todo.service';
import { Todo, TodoStatusType } from '../../core/models/models';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-todo-list-basic-signals',
  standalone: true,
  imports: [ButtonModule, SkeletonModule, FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 min-h-screen mx-auto w-2/3">
      <h1 class="text-2xl font-bold mb-4 uppercase">
        3. Todo List
        <span class="text-sm italic"> - basic signals</span>
        <span class="text-sm italic"> ({{ filteredTodosCount() }})</span>
      </h1>

      <!-- Filter Controls -->
      <div class="flex items-center gap-4 mb-4 ">
        <p-button
          [label]="'All'"
          [outlined]="filterStatus() !== 'ALL'"
          (onClick)="filterStatus.set('ALL')"
        ></p-button>
        <p-button
          [label]="'Completed'"
          [outlined]="filterStatus() !== 'COMPLETED'"
          (onClick)="filterStatus.set('COMPLETED')"
        ></p-button>
        <p-button
          [label]="'Not Completed'"
          [outlined]="filterStatus() !== 'NOT_COMPLETED'"
          (onClick)="filterStatus.set('NOT_COMPLETED')"
          class="whitespace-nowrap"
        />
        <div class="flex items-center w-full">
          <input
            type="text"
            placeholder="Search by title"
            class="p-2 border rounded w-full"
            [ngModel]="filterText()"
            (ngModelChange)="filterText.set($event)"
          />
          <p-button
            icon="pi pi-filter-slash"
            class="ml-2"
            (onClick)="filterText.set('')"
            [disabled]="!filterText()"
          ></p-button>
        </div>
      </div>

      <!-- Todo List Loading -->
      @if(isTodosLoading()) {
      <div class="shadow rounded p-4 bg-gray-100 dark:bg-gray-900">
        <p-skeleton styleClass="mb-2" />
        <p-skeleton styleClass="mb-2" />
        <p-skeleton styleClass="mb-2" />
      </div>

      }

      <!-- Todo List No Results -->
      @if(!isTodosLoading() && filteredTodos().length === 0) {
      <div
        class="flex justify-center items-center h-24 bg-gray-100 dark:bg-gray-900 rounded-lg"
      >
        <div class="text-xl">No todos.</div>
      </div>
      }

      <!-- Todo List  Results -->
      @if(!isTodosLoading() && filteredTodos().length > 0) {

      <ul class="shadow rounded p-4 bg-gray-100 dark:bg-gray-900">
        @for(todo of filteredTodos(); track todo.id) {
        <li
          class="flex justify-between items-center p-2 border-b last:border-none w-full"
        >
          <span [class.line-through]="todo.completed">
            {{ todo.title }}
          </span>
          <div class="flex items-center gap-2">
            <span
              class="px-2 py-1 text-xs rounded uppercase"
              [ngClass]="{
                'bg-green-200 text-green-800': todo.completed,
                'bg-yellow-200 text-yellow-800': !todo.completed
              }"
            >
              {{ todo.completed ? 'Completed' : 'Not Completed' }}
            </span>
            <p-button
              icon="pi pi-trash"
              class="p-button-sm rounded-full"
              severity="danger"
              (onClick)="deleteTodo(todo.id)"
            ></p-button>
          </div>
        </li>
        }
      </ul>

      }
    </div>
  `,
})
export class TodoListBasicSignalsComponent implements OnInit, OnDestroy {
  private todoService = inject(TodoService);
  private destroy$ = new Subject<void>();

  // State
  todos = signal<Todo[]>([]);
  isTodosLoading = signal(false);
  filterStatus = signal<TodoStatusType>('ALL');
  filterText = signal('');

  // Computed properties
  filteredTodos = computed(() => {
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
  filteredTodosCount = computed(() => this.filteredTodos().length);

  // Methods
  loadTodos(): void {
    this.isTodosLoading.set(true);
    this.todoService
      .getTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((todos: Todo[]) => {
        this.todos.set(todos);
        this.isTodosLoading.set(false);
      });
  }

  deleteTodo(todoId: number): void {
    this.todoService
      .deleteTodo(todoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.todos.update((currentTodos) =>
          currentTodos.filter((todo) => todo.id !== todoId)
        );
      });
  }
  ngOnInit(): void {
    this.loadTodos();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
