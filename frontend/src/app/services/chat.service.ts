import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  message: string;
  conversationId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly apiUrl = 'http://localhost:8080/api/chat';

  constructor(private readonly http: HttpClient) {}

  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(
      this.apiUrl,
      request
    );
  }
}