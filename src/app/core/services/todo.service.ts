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

  // Delete a todo
  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/todos/${id}`);
  }
}
