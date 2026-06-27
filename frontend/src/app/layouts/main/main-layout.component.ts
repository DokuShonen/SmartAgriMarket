import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  deconnexion() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }
}
