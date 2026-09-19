import {
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private destroyRef = inject(DestroyRef);

  countdown = signal<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  private readonly anniversaryDate =
    new Date('2026-11-22T08:00:00+08:00');

  constructor() {
    afterNextRender(() => {
      this.updateCountdown();

      const interval = setInterval(() => {
        this.updateCountdown();
      }, 1000);

      this.destroyRef.onDestroy(() => {
        clearInterval(interval);
      });
    });
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const target = this.anniversaryDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      this.countdown.set({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      });

      return;
    }

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
      (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
      (difference / 1000) % 60
    );

    this.countdown.set({
      days,
      hours,
      minutes,
      seconds
    });
  }

  scrollToStory(): void {
    document
      .getElementById('story-preview')
      ?.scrollIntoView({ behavior: 'smooth' });
  }
}