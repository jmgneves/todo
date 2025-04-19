import { TestBed } from '@angular/core/testing';
import { TodoService } from '../services/todo.service';
import { todoStore } from './todo.store';
import { of, Subject } from 'rxjs';
import { Todo, TodoStatusType } from '../models/models';
import { inject, signal } from '@angular/core';
const mockTodos: Todo[] = [
  { userId: 1, id: 1, title: 'Test Todo 1', completed: false },
  { userId: 1, id: 2, title: 'Test Todo 2', completed: true },
];

describe('TodoStore', () => {
  let todoServiceSpy: jasmine.SpyObj<TodoService>;
  let destroy$: Subject<void>;

  beforeEach(() => {
    destroy$ = new Subject<void>();
    todoServiceSpy = jasmine.createSpyObj('TodoService', [
      'getTodos',
      'deleteTodo',
    ]);

    todoServiceSpy.getTodos.and.returnValue(of(mockTodos));
    todoServiceSpy.deleteTodo.and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      providers: [
        { provide: TodoService, useValue: todoServiceSpy },
        todoStore,
      ],
    });
  });

  afterEach(() => {
    destroy$.next();
    destroy$.complete();
  });

  it('should load todos and update state', () => {
    const store = TestBed.inject(todoStore);

    expect(todoServiceSpy.getTodos).toHaveBeenCalled();
    expect(store.todos()).toEqual(mockTodos);
    expect(store.isTodosLoading()).toBeFalse();
  });

  it('should delete a todo and update state', () => {
    const store = TestBed.inject(todoStore);
    todoServiceSpy.deleteTodo.and.returnValue(of(undefined));

    store.deleteTodo(1);

    expect(todoServiceSpy.deleteTodo).toHaveBeenCalledWith(1);
    expect(store.todos()).toEqual([
      { userId: 1, id: 2, title: 'Test Todo 2', completed: true },
    ]);
    expect(store.deletedTodo()).toEqual({
      userId: 1,
      id: 1,
      title: 'Test Todo 1',
      completed: false,
    });
  });

  it('should set filter status and update state', () => {
    const store = TestBed.inject(todoStore);
    store.setFilterStatus('COMPLETED');

    expect(store.filterStatus()).toBe('COMPLETED');
  });

  it('should set filter text and update state', () => {
    const store = TestBed.inject(todoStore);
    store.setFilterText('Test');

    expect(store.filterText()).toBe('Test');
  });

  it('should compute filtered todos based on filter status and text', () => {
    const store = TestBed.inject(todoStore);

    store.setFilterStatus('COMPLETED');
    expect(store.filteredTodos()).toEqual([
      { userId: 1, id: 2, title: 'Test Todo 2', completed: true },
    ]);

    store.setFilterText('no match');
    expect(store.filteredTodos()).toEqual([]);
  });

  it('should compute filtered todos count', () => {
    const store = TestBed.inject(todoStore);

    store.setFilterStatus('COMPLETED');

    expect(store.filteredTodosCount()).toBe(1);

    store.setFilterText('no match');

    expect(store.filteredTodosCount()).toBe(0);
  });
});
