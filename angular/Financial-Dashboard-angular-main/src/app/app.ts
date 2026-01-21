import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from './components/navbar/navbar';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar></app-navbar>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  title = 'financial-dashboard';
}
