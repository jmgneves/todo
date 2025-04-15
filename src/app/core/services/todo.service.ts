import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';
  private readonly todosUrl = `${this.baseUrl}/users/1/todos`;

  constructor(private http: HttpClient) {}

  // Fetch all todos for user 1
  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todosUrl);
  }

  // Fetch a single todo by ID
  getTodoById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.baseUrl}/todos/${id}`);
  }

  // Create a new todo
  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${this.baseUrl}/todos`, todo);
  }

  // Update an existing todo
  updateTodo(id: number, todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.baseUrl}/todos/${id}`, todo);
  }

  // Delete a todo
  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/todos/${id}`);
  }
}
