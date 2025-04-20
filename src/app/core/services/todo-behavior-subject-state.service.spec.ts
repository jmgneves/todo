import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { TodoBehaviorSubjectStateService } from './todo-behavior-subject-state.service';
import { TodoService } from '../services/todo.service';
import { Todo, TodoStatusType } from '../models/models';

describe('TodoBehaviorSubjectStateService', () => {
  let service: TodoBehaviorSubjectStateService;
  let todoServiceMock: jasmine.SpyObj<TodoService>;

  const mockTodos: Todo[] = [
    { userId: 1, id: 1, title: 'Test Todo 1', completed: false },
    { userId: 1, id: 2, title: 'Test Todo 2', completed: true },
  ];

  beforeEach(() => {
    todoServiceMock = jasmine.createSpyObj('TodoService', [
      'getTodos',
      'deleteTodo',
    ]);

    // Mock the getTodos method to return an observable
    todoServiceMock.getTodos.and.returnValue(of(mockTodos));
    todoServiceMock.deleteTodo.and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      providers: [
        TodoBehaviorSubjectStateService,
        { provide: TodoService, useValue: todoServiceMock },
      ],
    });

    service = TestBed.inject(TodoBehaviorSubjectStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadTodos', () => {
    it('should load todos and update the todosSubject', () => {
      service.loadTodos();
      service.todos$.subscribe((todos) => {
        expect(todos).toEqual(mockTodos);
      });
      expect(todoServiceMock.getTodos).toHaveBeenCalled();
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo and update the todosSubject', () => {
      // Initialize the todosSubject with mockTodos
      service['todosSubject'].next(mockTodos);

      // Call deleteTodo with the ID of the todo to delete
      service.deleteTodo(1);

      // Assert the updated todos
      service.todos$.subscribe((todos) => {
        expect(todos).toEqual([
          { userId: 1, id: 2, title: 'Test Todo 2', completed: true },
        ]);
      });

      // Ensure the deleteTodo method was called with the correct ID
      expect(todoServiceMock.deleteTodo).toHaveBeenCalledWith(1);
    });
  });

  describe('setFilterStatus', () => {
    it('should update the filterStatusSubject', () => {
      service.setFilterStatus('COMPLETED');
      service.filterStatus$.subscribe((status) => {
        expect(status).toBe('COMPLETED');
      });
    });
  });

  describe('setFilterText', () => {
    it('should update the filterTextSubject', () => {
      service.setFilterText('Test');
      service.filterText$.subscribe((text) => {
        expect(text).toBe('Test');
      });
    });
  });

  describe('filteredTodos$', () => {
    it('should filter todos based on status and text', () => {
      service['todosSubject'].next(mockTodos);
      service.setFilterStatus('COMPLETED');
      service.setFilterText('Todo 2');

      service.filteredTodos$.subscribe((filteredTodos) => {
        expect(filteredTodos).toEqual([
          { userId: 1, id: 2, title: 'Test Todo 2', completed: true },
        ]);
      });
    });
  });

  describe('filteredTodosCount$', () => {
    it('should return the count of filtered todos', () => {
      service['todosSubject'].next(mockTodos);
      service.setFilterStatus('COMPLETED');
      service.setFilterText('Todo 2');

      service.filteredTodosCount$.subscribe((count) => {
        expect(count).toBe(1);
      });
    });
  });
});
