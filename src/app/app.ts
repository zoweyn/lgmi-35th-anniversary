import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    Navbar
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}