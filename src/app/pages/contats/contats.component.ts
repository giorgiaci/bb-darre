import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// Validators.required alone lets a string of only spaces through - this
// rejects whitespace-only input on top of the required check.
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

  // Timestamp when the form was rendered. Used as a simple bot heuristic:
  // real visitors take at least a couple seconds to fill out a form, bots
  // that script-submit it tend to do so almost instantly.
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
      message: ['', [Validators.required, Validators.maxLength(2000), noWhitespaceValidator]],
      // Honeypot field: hidden from real users via CSS, so only bots that
      // blindly fill in every field will populate it. See CONTACTS template.
      botcheck: [''],
    });
  }

  onSubmit(): void {

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    // Honeypot tripped, or submitted suspiciously fast for a human -> likely
    // a bot. Silently pretend success instead of actually sending the email.
    const submittedTooFast = Date.now() - this.formLoadedAt < 3000;
    if (this.contactForm.value.botcheck || submittedTooFast) {
      this.sending = false;
      this.submitted = true;
      this.contactForm.reset();
      return;
    }

    this.sending = true;
    this.error = false;

    const formData = {
      access_key: environment.web3formsAccessKey,
      name: this.contactForm.value.name.trim(),
      email: this.contactForm.value.email.trim(),
      subject: this.contactForm.value.subject.trim(),
      message: this.contactForm.value.message.trim(),
      botcheck: this.contactForm.value.botcheck,
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
