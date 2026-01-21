import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { signal } from '@angular/core';
import {TodoService} from '../todo-service';
import {Todo} from '../todo-model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './to-do.html',
  styleUrl: './to-do.css',
})
export class TodoListComponent {
  private todoService = inject(TodoService);
  todos = signal<Todo[]>([]);
  newTodoTitle = '';

  // Editing state
  editingId = signal<number | null>(null);
  editTitle = '';

  constructor() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(todos => {
      this.todos.set(todos);
    });
  }

  addTodo() {
    if (this.newTodoTitle.trim()) {
      const newTodo = {
        title: this.newTodoTitle.trim(),
        completed: false
      };
      this.todoService.addTodo(newTodo).subscribe(() => {
        this.loadTodos();
        this.newTodoTitle = '';
      });
    }
  }

  toggleTodo(todo: Todo) {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed
    };
    this.todoService.updateTodo(updatedTodo).subscribe(() => {
      this.loadTodos();
    });
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.loadTodos();
    });
  }

  // Editing methods
  startEdit(todo: Todo) {
    this.editingId.set(todo.id!);
    this.editTitle = todo.title;
  }

  saveEdit(id: number) {
    if (this.editTitle.trim()) {
      const updatedTodo = {
        id,
        title: this.editTitle.trim(),
        completed: this.todos().find(t => t.id === id)?.completed || false
      };
      this.todoService.updateTodo(updatedTodo).subscribe(() => {
        this.loadTodos();
        this.editingId.set(null);
      });
    } else {
      // If empty, cancel edit
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editTitle = '';
  }
}