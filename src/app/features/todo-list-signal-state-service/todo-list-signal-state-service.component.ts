import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoStatusType } from '../../core/models/models';
import { TodoSignalStateService } from '../../core/services/todo-signal-state.service';

@Component({
  selector: 'app-todo-list-signal-state-service',
  standalone: true,
  imports: [ButtonModule, SkeletonModule, FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 min-h-screen mx-auto w-2/3">
      <h1 class="text-2xl font-bold mb-4 uppercase">
        4. Todo List
        <span class="text-sm italic"> - signal state service</span>
        <span class="text-sm italic">
          ({{ todoState.filteredTodosCount() }})</span
        >
      </h1>

      <!-- Filter Controls -->
      <div class="flex items-center gap-4 mb-4 ">
        <p-button
          [label]="'All'"
          [outlined]="todoState.filterStatus() !== 'ALL'"
          (onClick)="todoState.setFilterStatus('ALL')"
        ></p-button>
        <p-button
          [label]="'Completed'"
          [outlined]="todoState.filterStatus() !== 'COMPLETED'"
          (onClick)="todoState.setFilterStatus('COMPLETED')"
        ></p-button>
        <p-button
          [label]="'Not Completed'"
          [outlined]="todoState.filterStatus() !== 'NOT_COMPLETED'"
          (onClick)="todoState.setFilterStatus('NOT_COMPLETED')"
          class="whitespace-nowrap"
        />
        <div class="flex items-center w-full">
          <input
            type="text"
            placeholder="Search by title"
            class="p-2 border rounded w-full"
            [ngModel]="todoState.filterText()"
            (ngModelChange)="todoState.setFilterText($event)"
          />
          <p-button
            icon="pi pi-filter-slash"
            class="ml-2"
            (onClick)="todoState.setFilterText('')"
            [disabled]="!todoState.filterText()"
          ></p-button>
        </div>
      </div>

      <!-- Todo List Loading -->
      @if(todoState.isTodosLoading()) {
      <div class="shadow rounded p-4 bg-gray-100 dark:bg-gray-900">
        <p-skeleton styleClass="mb-2" />
        <p-skeleton styleClass="mb-2" />
        <p-skeleton styleClass="mb-2" />
      </div>

      }

      <!-- Todo List No Results -->
      @if(!todoState.isTodosLoading() && todoState.filteredTodos().length === 0)
      {
      <div
        class="flex justify-center items-center h-24 bg-gray-100 dark:bg-gray-900 rounded-lg"
      >
        <div class="text-xl">No todos.</div>
      </div>
      }

      <!-- Todo List  Results -->
      @if(!todoState.isTodosLoading() && todoState.filteredTodos().length > 0) {

      <ul class="shadow rounded p-4 bg-gray-100 dark:bg-gray-900">
        @for(todo of todoState.filteredTodos(); track todo.id) {
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
              (onClick)="todoState.deleteTodo(todo.id)"
            ></p-button>
          </div>
        </li>
        }
      </ul>

      }
    </div>
  `,
})
export class TodoListSignalStateServiceComponent {
  todoState = inject(TodoSignalStateService);
}
