import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoStatusType } from '../../core/models/models';
import { TODO_FILTER_OPTIONS } from '../../core/constants/todo-filter-options';
import { TodoBehaviorSubjectStateService } from '../../core/services/todo-behavior-subject-state.service';

@Component({
  selector: 'app-todo-list-basic-app-service',
  standalone: true,
  imports: [ButtonModule, SkeletonModule, FormsModule, CommonModule],
  styleUrl: './todo-list-basic-app-service.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 min-h-screen mx-auto w-2/3">
      <h1 class="text-2xl font-bold mb-4">
        Todo List
        <span class="text-sm italic"> - BehaviorSubject state service</span>
        <span class="text-sm italic">
          ({{ (filteredTodosCount$ | async) ?? 0 }})</span
        >
      </h1>

      <!-- Filter Controls -->
      <div class="flex items-center gap-4 mb-4 ">
        <p-button
          [label]="'All'"
          [outlined]="(filterStatus$ | async) !== 'ALL'"
          (onClick)="onFilterButtonClick('ALL')"
        ></p-button>
        <p-button
          [label]="'Completed'"
          [outlined]="(filterStatus$ | async) !== 'COMPLETED'"
          (onClick)="onFilterButtonClick('COMPLETED')"
        ></p-button>
        <p-button
          [label]="'Not Completed'"
          [outlined]="(filterStatus$ | async) !== 'NOT_COMPLETED'"
          (onClick)="onFilterButtonClick('NOT_COMPLETED')"
          class="whitespace-nowrap"
        />
        <div class="flex items-center w-full">
          <input
            type="text"
            placeholder="Search by title"
            class="p-2 border rounded w-full"
            [ngModel]="(filterText$ | async) ?? ''"
            (ngModelChange)="onSearchChange($event)"
          />
          <p-button
            icon="pi pi-filter-slash"
            class="ml-2"
            (onClick)="clearFilterText()"
            [disabled]="!(filterText$ | async)"
          ></p-button>
        </div>
      </div>

      <!-- Todo List Loading -->
      <div
        *ngIf="isTodosLoading$ | async; else todoListContent"
        class="shadow rounded p-4 bg-gray-100 dark:bg-gray-900"
      >
        <p-skeleton styleClass="mb-2" />
        <p-skeleton styleClass="mb-2" />
        <p-skeleton styleClass="mb-2" />
      </div>

      <ng-template #todoListContent>
        <!-- Todo List No Results -->
        <div
          *ngIf="(filteredTodos$ | async)?.length === 0; else todoListResults"
          class="flex justify-center items-center h-24 bg-gray-100 dark:bg-gray-900 rounded-lg"
        >
          <div class="text-xl">No todos.</div>
        </div>

        <!-- Todo List Results -->
        <ng-template #todoListResults>
          <ul class="shadow rounded p-4 bg-gray-100 dark:bg-gray-900">
            <li
              *ngFor="let todo of filteredTodos$ | async; trackBy: trackById"
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
                  (onClick)="onDeleteTodo(todo.id)"
                ></p-button>
              </div>
            </li>
          </ul>
        </ng-template>
      </ng-template>
    </div>
  `,
})
export class TodoListBasicAppServiceComponent {
  todoStateService = inject(TodoBehaviorSubjectStateService); // Replace with TodoBehaviorSubjectStateService

  // Observables from the service
  todos$ = this.todoStateService.todos$;
  isTodosLoading$ = this.todoStateService.isTodosLoading$;
  filterStatus$ = this.todoStateService.filterStatus$;
  filterText$ = this.todoStateService.filterText$;
  filteredTodos$ = this.todoStateService.filteredTodos$;
  filteredTodosCount$ = this.todoStateService.filteredTodosCount$;

  onFilterButtonClick(value: string): void {
    this.todoStateService.setFilterStatus(value as TodoStatusType);
  }

  onSearchChange(val: string): void {
    this.todoStateService.setFilterText(val);
  }

  onDeleteTodo(todoId: number): void {
    this.todoStateService.deleteTodo(todoId);
  }

  clearFilterText(): void {
    this.todoStateService.setFilterText('');
  }

  trackById(index: number, todo: any): number {
    return todo.id;
  }
}
