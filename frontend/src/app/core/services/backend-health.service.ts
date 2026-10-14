import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, switchMap, catchError, of, takeWhile, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BackendHealthService {

  private attemptCount = 0;
  private maxAttempts = 20;

  constructor(private http: HttpClient) {}

  checkHealth(): Observable<boolean> {
    return this.http.get<any>(`${environment.apiUrl}/health`).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  waitForBackend(intervalMs = 2000, maxAttempts = 20): Observable<boolean> {
    this.attemptCount = 0;
    this.maxAttempts = maxAttempts;

    return timer(0, intervalMs).pipe(
      switchMap(() => {
        this.attemptCount++;
        return this.checkHealth();
      }),
      tap(ready => {
        if (ready) {
          this.attemptCount = 0;
        }
      }),
      takeWhile(ready => !ready && this.attemptCount < this.maxAttempts, true)
    );
  }
}
