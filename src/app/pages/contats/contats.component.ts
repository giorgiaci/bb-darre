import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  return (control.value ?? '').trim().length === 0 ? { whitespace: true } : null;
}

@Component({
  selector: 'app-contats',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './contats.component.html',
  styleUrl: './contats.component.scss',
})
export class ContatsComponent implements OnInit {
  contactForm!: FormGroup;

  sending = false;
  submitted = false;
  error = false;

  private formLoadedAt = Date.now();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100), noWhitespaceValidator]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      subject: ['', [Validators.required, Validators.maxLength(150), noWhitespaceValidator]],
      message: ['', [Validators.required, Validators.maxLength(2000), noWhitespaceValidator]]
    });
  }

  onSubmit(): void {

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    const submittedTooFast = Date.now() - this.formLoadedAt < 3000;
    if (submittedTooFast) {
      this.sending = false;
      this.submitted = true;
      this.contactForm.reset();
      return;
    }

    this.sending = true;
    this.error = false;

    const accessKey = (environment.web3formsAccessKey ?? '').trim();
    if (!accessKey) {
      this.sending = false;
      this.error = true;
      return;
    }

    const formData = {
      access_key: accessKey,
      name: this.contactForm.value.name.trim(),
      email: this.contactForm.value.email.trim(),
      subject: this.contactForm.value.subject.trim(),
      message: this.contactForm.value.message.trim()
    };

    this.http.post('https://api.web3forms.com/submit', formData).subscribe({
      next: () => {
        this.sending = false;
        this.submitted = true;
        this.contactForm.reset();
      },

      error: () => {
        this.sending = false;
        this.error = true;
      },
    });
  }
}
