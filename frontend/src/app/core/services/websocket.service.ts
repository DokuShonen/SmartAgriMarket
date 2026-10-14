import { Injectable, OnDestroy } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {
  private client: Client;
  private connected = false;
  private notificationSubject = new Subject<any>();

  constructor() {
    const wsUrl = environment.wsUrl === 'auto'
      ? `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`
      : environment.wsUrl;

    this.client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    this.client.onConnect = () => {
      this.connected = true;
      this.client.subscribe('/user/topic/notifications', (message: IMessage) => {
        this.notificationSubject.next(JSON.parse(message.body));
      });
    };

    this.client.onDisconnect = () => {
      this.connected = false;
    };
  }

  connect(token: string): void {
    if (this.connected) return;
    this.client.connectHeaders = { Authorization: `Bearer ${token}` };
    this.client.activate();
  }

  disconnect(): void {
    this.client.deactivate();
    this.connected = false;
  }

  onNotification(): Observable<any> {
    return this.notificationSubject.asObservable();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
