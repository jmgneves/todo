import { TestBed } from '@angular/core/testing';
import { TodoSignalStateService } from './todo-signal-state.service';
import { TodoService } from './todo.service';
import { of } from 'rxjs';
import { Todo, TodoStatusType } from '../models/models';

describe('TodoSignalStateService', () => {
  let service: TodoSignalStateService;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;

  beforeEach(() => {
    const todoServiceMock = jasmine.createSpyObj('TodoService', [
      'getTodos',
      'deleteTodo',
    ]);
    todoServiceMock.getTodos.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        TodoSignalStateService,
        { provide: TodoService, useValue: todoServiceMock },
      ],
    });

    service = TestBed.inject(TodoSignalStateService);
    todoServiceSpy = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load todos on initialization', () => {
    const mockTodos: Todo[] = [
      { userId: 1, id: 1, title: 'Test Todo 1', completed: false },
      { userId: 1, id: 2, title: 'Test Todo 2', completed: true },
    ];
    todoServiceSpy.getTodos.and.returnValue(of(mockTodos));

    service.loadTodos();

    expect(todoServiceSpy.getTodos).toHaveBeenCalled();
    expect(service.todos()).toEqual(mockTodos);
    expect(service.isTodosLoading()).toBeFalse();
  });

  it('should delete a todo', () => {
    const mockTodos: Todo[] = [
      { userId: 1, id: 1, title: 'Test Todo 1', completed: false },
      { userId: 1, id: 2, title: 'Test Todo 2', completed: true },
    ];
    service.todos.set(mockTodos);
    todoServiceSpy.deleteTodo.and.returnValue(of(undefined));

    service.deleteTodo(1);

    expect(todoServiceSpy.deleteTodo).toHaveBeenCalledWith(1);
    expect(service.todos()).toEqual([
      { userId: 1, id: 2, title: 'Test Todo 2', completed: true },
    ]);
  });

  it('should filter todos by status and text', () => {
    const mockTodos: Todo[] = [
      { userId: 1, id: 1, title: 'Test Todo 1', completed: false },
      { userId: 1, id: 2, title: 'Test Todo 2', completed: true },
      { userId: 1, id: 3, title: 'Another Todo', completed: false },
    ];
    service.todos.set(mockTodos);

    service.setFilterStatus('COMPLETED');
    expect(service.filteredTodos()).toEqual([
      { userId: 1, id: 2, title: 'Test Todo 2', completed: true },
    ]);

    service.setFilterStatus('NOT_COMPLETED');
    expect(service.filteredTodos()).toEqual([
      { userId: 1, id: 1, title: 'Test Todo 1', completed: false },
      { userId: 1, id: 3, title: 'Another Todo', completed: false },
    ]);

    service.setFilterText('Test');
    expect(service.filteredTodos()).toEqual([
      { userId: 1, id: 1, title: 'Test Todo 1', completed: false },
    ]);
  });

  it('should update filteredTodosCount correctly', () => {
    const mockTodos: Todo[] = [
      { userId: 1, id: 1, title: 'Test Todo 1', completed: false },
      { userId: 1, id: 2, title: 'Test Todo 2', completed: true },
    ];
    service.todos.set(mockTodos);

    service.setFilterStatus('COMPLETED');
    expect(service.filteredTodosCount()).toBe(1);

    service.setFilterStatus('ALL');
    expect(service.filteredTodosCount()).toBe(2);
  });

  it('should set filter status correctly', () => {
    service.setFilterStatus('COMPLETED');
    expect(service.filterStatus()).toBe('COMPLETED');

    service.setFilterStatus('NOT_COMPLETED');
    expect(service.filterStatus()).toBe('NOT_COMPLETED');
  });

  it('should set filter text correctly', () => {
    service.setFilterText('Test');
    expect(service.filterText()).toBe('Test');

    service.setFilterText('Another');
    expect(service.filterText()).toBe('Another');
  });

  it('should handle empty todos list', () => {
    service.todos.set([]);
    service.setFilterStatus('COMPLETED');
    expect(service.filteredTodos()).toEqual([]);
    expect(service.filteredTodosCount()).toBe(0);
  });

  it('should handle todos loading state', () => {
    todoServiceSpy.getTodos.and.returnValue(of([]));

    service.loadTodos();

    expect(service.isTodosLoading()).toBeFalse();
  });
});
