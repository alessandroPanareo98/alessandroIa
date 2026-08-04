import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  readonly form = this.fb.group({
    gitlabUrl: ['https://gitlab.com', Validators.required],
    aiBaseUrl: ['http://localhost:11434', Validators.required],
    webhookToken: ['', Validators.required]
  });

  saved = false;

  constructor(private readonly fb: FormBuilder) {}

  save(): void {
    if (this.form.invalid) {
      return;
    }
    this.saved = true;
  }
}
