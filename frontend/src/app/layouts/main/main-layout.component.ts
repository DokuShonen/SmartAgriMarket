import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService, Notification } from '../../core/services/notification.service';
import { PanierService } from '../../core/services/panier.service';
import { WebSocketService } from '../../core/services/websocket.service';
import { ToastComponent } from '../../core/components/toast.component';
import { OnboardingComponent } from '../../features/onboarding/onboarding.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, NgFor, DatePipe, ToastComponent, OnboardingComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  nonLues = 0;
  showNotifications = false;
  panierCount = 0;
  isMobile = false;
  private lastScrollY = 0;
  private topbarHidden = false;

  constructor(
    public auth: AuthService,
    public router: Router,
    private notificationService: NotificationService,
    private webSocketService: WebSocketService,
    public panierService: PanierService
  ) {}

  ngOnInit() {
    this.isMobile = window.innerWidth <= 768;
    this.panierService.getItems().subscribe(items => {
      this.panierCount = items.reduce((sum, i) => sum + i.quantite, 0);
    });
    if (this.auth.isLoggedIn) {
      this.chargerNotifications();
      setInterval(() => this.chargerNotifications(), 30000);
      this.webSocketService.connect(this.auth.token!);
      this.webSocketService.onNotification().subscribe(() => {
        this.chargerNotifications();
      });
    }

    // Scroll to top on navigation
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      this.showNotifications = false;
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    const currentY = window.scrollY;
    const topbar = document.querySelector('.topbar') as HTMLElement;
    if (!topbar) return;

    if (currentY > 100 && currentY > this.lastScrollY && !this.topbarHidden) {
      topbar.style.transform = 'translateY(-100%)';
      this.topbarHidden = true;
    } else if (currentY < this.lastScrollY && this.topbarHidden) {
      topbar.style.transform = 'translateY(0)';
      this.topbarHidden = false;
    }
    this.lastScrollY = currentY;
  }

  chargerNotifications() {
    this.notificationService.getNonLues().subscribe(r => this.nonLues = r.count);
    this.notificationService.getMesNotifications().subscribe(n => this.notifications = n.slice(0, 10));
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.chargerNotifications();
    }
  }

  marquerLue(n: Notification) {
    this.notificationService.marquerLue(n.id).subscribe(() => {
      this.chargerNotifications();
      if (n.lien) this.router.navigate([n.lien]);
    });
  }

  marquerToutLu() {
    this.notificationService.marquerToutLu().subscribe(() => this.chargerNotifications());
  }

  deconnexion() {
    this.webSocketService.disconnect();
    this.auth.logout();
    this.notifications = [];
    this.nonLues = 0;
    this.router.navigate(['/']);
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  isAdmin(): boolean {
    const t = this.auth.utilisateur()?.type;
    return t === 'ADMIN' || t === 'SUPER_ADMIN' || t === 'MODERATION_SUPPORT';
  }

  ngOnDestroy() {
    this.webSocketService.disconnect();
  }
}
