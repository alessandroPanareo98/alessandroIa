import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class ChatComponent {

  messages: ChatMessage[] = [];

  message = '';
  loading = false;

  conversationId?: string;

  constructor(
    private readonly chatService: ChatService
  ) {}

  sendMessage(): void {

    const content = this.message.trim();

    if (!content || this.loading) {
      return;
    }

    // Messaggio dell'utente
    this.messages.push({
      role: 'user',
      content,
      timestamp: new Date()
    });

    this.message = '';
    this.loading = true;

    this.chatService.sendMessage({
      message: content,
      conversationId: this.conversationId
    }).subscribe({

      next: response => {

        this.conversationId = response.conversationId;

        this.messages.push({
          role: 'assistant',
          content: response.message,
          timestamp: new Date()
        });

        this.loading = false;
      },

      error: error => {

        console.error('Errore comunicazione AI:', error);

        this.messages.push({
          role: 'assistant',
          content: 'Si è verificato un errore nella comunicazione con il server.',
          timestamp: new Date()
        });

        this.loading = false;
      }

    });
  }
}