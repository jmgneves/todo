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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-list-behavior-subject-state-service.component.html',
})
export class TodoListBehaviorSubjectStateServiceComponent {
  todoState = inject(TodoBehaviorSubjectStateService);

  // Observables from the service
  todos$ = this.todoState.todos$;
  isTodosLoading$ = this.todoState.isTodosLoading$;
  filterStatus$ = this.todoState.filterStatus$;
  filterText$ = this.todoState.filterText$;
  filteredTodos$ = this.todoState.filteredTodos$;
  filteredTodosCount$ = this.todoState.filteredTodosCount$;

  trackById(index: number, todo: any): number {
    return todo.id;
  }
}
