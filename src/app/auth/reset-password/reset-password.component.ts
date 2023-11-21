/** @format */

import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorMessage } from "@error/models/error-message";
import { AuthService } from "@auth/services";
import { ValidationService } from "@core/services";
import { Router } from "@angular/router";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly validationService: ValidationService,
    private readonly router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  resetForm: FormGroup;
  isSubmitting = false;

  errorMessage = ErrorMessage;
  errorServer = false;

  onSubmit(): void {
    if (!this.validationService.getFormValidation(this.resetForm)) return;

    this.errorServer = false;
    this.isSubmitting = true;

    this.authService.resetPassword(this.resetForm.value.email).subscribe({
      next: () => {
        this.router
          .navigate(["/auth/reset_password/confirm"], {
            queryParams: { email: this.resetForm.value.email },
          })
          .then(() => console.debug("ResetPasswordComponent"));
      },
      error: () => {
        this.errorServer = true;
        this.isSubmitting = false;

        this.resetForm.reset();
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
}
