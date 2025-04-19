import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { Todo } from '../models/models';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  const mockTodos: Todo[] = [
    { id: 1, title: 'Test Todo 1', completed: false, userId: 1 },
    { id: 2, title: 'Test Todo 2', completed: true, userId: 1 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService],
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch todos (getTodos)', () => {
    service.getTodos().subscribe((todos) => {
      expect(todos.length).toBe(2);
      expect(todos).toEqual(mockTodos);
    });

    const req = httpMock.expectOne(service['todosUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos); // Respond with mock data
  });
  it('should delete a todo (deleteTodo)', () => {
    const todoId = 1;

    service.deleteTodo(todoId).subscribe((response) => {
      expect(response).toBeNull(); // Adjusted to expect null
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/todos/${todoId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Respond with null as the backend typically does
  });
});
