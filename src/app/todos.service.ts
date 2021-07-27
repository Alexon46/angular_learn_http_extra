import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {catchError, delay, map, tap} from 'rxjs/operators'

export interface Todo {
  completed: boolean
  title: string
  error?: string
  id?: number
}

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(private http: HttpClient) { }

  addTodo(todo: Todo): Observable<Todo>{
    return this.http.post<Todo>('https://jsonplaceholder.typicode.com/todos', todo, {
      headers: new HttpHeaders({
        'MyCustomHeader': Math.random().toString()
      })
    })
  }

  fetchTodos(): Observable<Todo[]>{
    let params = new HttpParams();
    params = params.append('_limit', 5)
    return this.http.get<any>('https://jsonplaceholder.typicode.com/todos', {
      params,
      observe: 'response'
    }).pipe(
      map((res)=>{
        return res.body
      }),
      delay(600),
      catchError(error=>{
        console.log(error.message)
        return throwError(error)
      })
    )
  }

  removeTodo(id:number): Observable<any>{
    return this.http.delete<void>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      observe: 'events'
    }).pipe(
      tap(event=>{
        if(event.type === HttpEventType.Sent){
          console.log(event);
        }
      })
    )
  }

  comleteTodo(id:number): Observable<Todo>{
    return this.http.put<Todo>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      completed: true
    })
  }


}
