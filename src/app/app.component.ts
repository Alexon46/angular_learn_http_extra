import { Component, OnInit } from '@angular/core';
import { Todo, TodosService } from './todos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  todos: Todo[] = []
  loading = false
  todoTitle: string = ''
  
  constructor(private todosService: TodosService){}

  ngOnInit(){
    this.fetchTodos()
  }

  addTodo(){
    if(!this.todoTitle.trim()) return;

    const newTodo: Todo = {
      title: this.todoTitle,
      completed: false
    }

    this.todosService.addTodo({
      title: this.todoTitle,
      completed: false
    }).subscribe((todo)=>{
      console.log('Todo ', todo)
      this.todos.push(todo)
      this.todoTitle = ''
    })

  }

  fetchTodos(){
    this.loading = true;
    this.todosService.fetchTodos()
      .subscribe(todos => {
        this.todos = todos
        this.loading = false;
        console.log('Res', todos)
      })
  }


  removeTodo(id:number){
    this.todosService.removeTodo(id)
      .subscribe((res)=>{
        // console.log(res)
        this.todos = this.todos.filter((t)=>{
          return t.id !== id
        })
      })
  }

  comleteTodo(id:number){
    this.todosService.comleteTodo(id)
      .subscribe((todo)=>{
        console.log(todo)
        const comletedTodo = this.todos.find(t=>t.id===todo.id);
        if(comletedTodo){
          comletedTodo.completed = true
        }
      }, error=>{
        const comletedTodo = this.todos.find(t=>t.id===id);
        if(comletedTodo){
          comletedTodo.error = error.message
        }
      })
  }


}
