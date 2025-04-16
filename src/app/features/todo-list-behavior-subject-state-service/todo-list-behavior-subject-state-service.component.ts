import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoStatusType } from '../../core/models/models';
import { TodoBehaviorSubjectStateService } from '../../core/services/todo-behavior-subject-state.service';

@Component({
  selector: 'app-todo-list-behavior-subject-state-service',
  standalone: true,
  imports: [ButtonModule, SkeletonModule, FormsModule, CommonModule],
  styleUrl: './todo-list-behavior-subject-state-service.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-list-behavior-subject-state-service.component.html',
})
export class TodoListBehaviorSubjectStateServiceComponent {
  todoStateService = inject(TodoBehaviorSubjectStateService);

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
