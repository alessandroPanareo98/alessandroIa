import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class ChatComponent {

  @ViewChild('messagesContainer')
  private messagesContainer!: ElementRef<HTMLDivElement>;

  message = '';

  loading = false;

  messages: ChatMessage[] = [
    {
      role: 'assistant',
      content: 'Ciao! 👋 Sono il tuo AI DevOps Assistant. Come posso aiutarti?',
      timestamp: new Date()
    }
  ];

  sendMessage(): void {
    const content = this.message.trim();

    if (!content || this.loading) {
      return;
    }

    // Messaggio utente
    this.messages.push({
      role: 'user',
      content,
      timestamp: new Date()
    });

    this.message = '';

    this.scrollToBottom();

    // Simulazione risposta AI
    this.loading = true;

    setTimeout(() => {

      this.messages.push({
        role: 'assistant',
        content: `Ho ricevuto il tuo messaggio:

"${content}"

Questa è una risposta simulata. Successivamente collegheremo questa chat al backend Spring Boot.`,
        timestamp: new Date()
      });

      this.loading = false;

      this.scrollToBottom();

    }, 1000);
  }

  onKeyDown(event: KeyboardEvent): void {

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;

        element.scrollTop = element.scrollHeight;
      }
    });
  }
}