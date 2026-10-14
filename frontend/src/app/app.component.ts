import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { PwaInstallComponent } from './features/pwa/pwa-install.component';
import { SplashComponent } from './core/components/splash.component';

export const routeAnimation = trigger('routeAnimation', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(12px)' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('150ms ease-out', style({ opacity: 0, transform: 'translateY(-8px)' }))
      ], { optional: true }),
      query(':enter', [
        animate('250ms 100ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { optional: true })
    ])
  ])
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PwaInstallComponent, SplashComponent],
  template: `<app-splash /><div [@routeAnimation]="getRouteAnimationData()"><router-outlet /></div><app-pwa-install />`,
  animations: [routeAnimation]
})
export class AppComponent {
  getRouteAnimationData(): string {
    return ''; // Let Angular handle by outlet position
  }
}
