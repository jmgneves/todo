import {
  Component,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { TodoService } from '../../core/services/todo.service';
import { Todo, TodoStatusType } from '../../core/models/models';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-todo-list-basic',
  standalone: true,
  imports: [ButtonModule, SkeletonModule, FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 min-h-screen mx-auto w-2/3">
      <h1 class="text-2xl font-bold mb-4 uppercase">
        Todo List
        <span class="text-sm italic"> - basic</span>
        <span class="text-sm italic"> ({{ filteredTodosCount }})</span>
      </h1>

      <!-- Filter Controls -->
      <div class="flex items-center gap-4 mb-4 ">
        <p-button
          [label]="'All'"
          [outlined]="filterStatus !== 'ALL'"
          (onClick)="setFilterStatus('ALL')"
        ></p-button>
        <p-button
          [label]="'Completed'"
          [outlined]="filterStatus !== 'COMPLETED'"
          (onClick)="setFilterStatus('COMPLETED')"
        ></p-button>
        <p-button
          [label]="'Not Completed'"
          [outlined]="filterStatus !== 'NOT_COMPLETED'"
          (onClick)="setFilterStatus('NOT_COMPLETED')"
          class="whitespace-nowrap"
        ></p-button>
        <div class="flex items-center w-full">
          <input
            type="text"
            placeholder="Search by title"
            class="p-2 border rounded w-full"
            [(ngModel)]="filterText"
            (ngModelChange)="applyFilters()"
          />
          <p-button
            icon="pi pi-filter-slash"
            class="ml-2"
            (onClick)="clearFilterText()"
            [disabled]="!filterText"
          ></p-button>
        </div>
      </div>

      <!-- Todo List Loading -->
      <ng-container *ngIf="isTodosLoading">
        <div class="shadow rounded p-4 bg-gray-100 dark:bg-gray-900">
          <p-skeleton styleClass="mb-2"></p-skeleton>
          <p-skeleton styleClass="mb-2"></p-skeleton>
          <p-skeleton styleClass="mb-2"></p-skeleton>
        </div>
      </ng-container>

      <!-- Todo List No Results -->
      <ng-container *ngIf="!isTodosLoading && filteredTodos.length === 0">
        <div
          class="flex justify-center items-center h-24 bg-gray-100 dark:bg-gray-900 rounded-lg"
        >
          <div class="text-xl">No todos.</div>
        </div>
      </ng-container>

      <!-- Todo List Results -->
      <ul
        *ngIf="!isTodosLoading && filteredTodos.length > 0"
        class="shadow rounded p-4 bg-gray-100 dark:bg-gray-900"
      >
        <li
          *ngFor="let todo of filteredTodos; trackBy: trackByTodoId"
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
      </ul>
    </div>
  `,
})
export class TodoListBasicComponent implements OnInit, OnDestroy {
  private todoService = inject(TodoService);
  private cdr = inject(ChangeDetectorRef);

  // State
  todos: Todo[] = [];
  isTodosLoading = false;
  filterStatus: TodoStatusType = 'ALL';
  filterText = '';

  // Derived state
  filteredTodos: Todo[] = [];
  filteredTodosCount = 0;
  private destroy$ = new Subject<void>();

  // Methods
  loadTodos(): void {
    this.isTodosLoading = true;
    this.cdr.markForCheck();

    this.todoService
      .getTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((todos: Todo[]) => {
        this.todos = todos;
        this.isTodosLoading = false;
        this.applyFilters();
      });
  }

  deleteTodo(todoId: number): void {
    this.todoService
      .deleteTodo(todoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.todos = this.todos.filter((todo) => todo.id !== todoId);
        this.applyFilters();
      });
  }

  setFilterStatus(status: TodoStatusType): void {
    this.filterStatus = status;
    this.applyFilters();
  }

  clearFilterText(): void {
    this.filterText = '';
    this.applyFilters();
  }

  applyFilters(): void {
    const status = this.filterStatus;
    const text = this.filterText.toLowerCase();

    this.filteredTodos = this.todos.filter((todo) => {
      const matchesStatus =
        status === 'ALL' ||
        (status === 'COMPLETED' && todo.completed) ||
        (status === 'NOT_COMPLETED' && !todo.completed);
      const matchesText = todo.title.toLowerCase().includes(text);
      return matchesStatus && matchesText;
    });

    this.filteredTodosCount = this.filteredTodos.length;
    this.cdr.markForCheck();
  }

  trackByTodoId(index: number, todo: Todo): number {
    return todo.id;
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cdr.detach();
  }
}
