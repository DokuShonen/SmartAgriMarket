import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UploadResponse {
  url: string;
  filename: string;
}

@Injectable({ providedIn: 'root' })
export class UploadService extends ApiService {

  upload(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(`${this.baseUrl}/upload`, formData);
  }
}
