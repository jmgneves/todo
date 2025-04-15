import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { todoStore } from './todo.store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoStatusType } from './core/models/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, FormsModule, CommonModule],
  providers: [todoStore],
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 min-h-screen mx-auto w-2/3">
      <h1 class="text-2xl font-bold mb-4">Todo List</h1>

      <!-- Filter Controls -->
      <div class="flex items-center gap-4 mb-4 ">
        <p-button
          [label]="'All'"
          [outlined]="todoStore.filterStatus() !== 'ALL'"
          (onClick)="onFilterButtonClick('ALL')"
        ></p-button>
        <p-button
          [label]="'Completed'"
          [outlined]="todoStore.filterStatus() !== 'COMPLETED'"
          (onClick)="onFilterButtonClick('COMPLETED')"
        ></p-button>
        <p-button
          [label]="'Not Completed'"
          [outlined]="todoStore.filterStatus() !== 'NOT_COMPLETED'"
          (onClick)="onFilterButtonClick('NOT_COMPLETED')"
          class="whitespace-nowrap"
        />
        <div class="flex items-center w-full">
          <input
            type="text"
            placeholder="Search by title"
            class="p-2 border rounded w-full"
            [ngModel]="todoStore.filterText()"
            (ngModelChange)="onSearchChange($event)"
          />
          <p-button
            icon="pi pi-filter-slash"
            class="ml-2"
            (onClick)="clearFilterText()"
            [disabled]="!todoStore.filterText()"
          ></p-button>
        </div>
      </div>

      <!-- Todo List -->
      <ul class="shadow rounded p-4 bg-gray-900">
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
              (onClick)="onDeleteTodo(todo.id)"
            ></p-button>
          </div>
        </li>
        }
      </ul>
    </div>
  `,
})
export class AppComponent {
  todoStore = inject(todoStore);
  title = 'ava todo';
  filterOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Not Completed', value: 'NOT_COMPLETED' },
  ];
  selectedFilter = 'ALL';

  filteredTodos = this.todoStore.filteredTodos;

  onFilterButtonClick(value: string): void {
    this.todoStore.setFilterStatus(value as TodoStatusType);
  }

  onSearchChange(val: string): void {
    this.todoStore.setFilterText(val);
  }
  onDeleteTodo(todoId: number): void {
    this.todoStore.deleteTodo(todoId);
  }
  clearFilterText(): void {
    this.todoStore.setFilterText('');
  }
}
