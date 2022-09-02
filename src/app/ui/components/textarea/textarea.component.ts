/** @format */

import { Component, forwardRef, Input, OnInit } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-textarea",
  templateUrl: "./textarea.component.html",
  styleUrls: ["./textarea.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder = "";
  @Input() type: "text" | "password" | "email" = "text";
  @Input() error = false;
  @Input() mask = "";

  constructor() {}

  ngOnInit(): void {}

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouch();
  }

  value = "";
  writeValue(value: string): void {
    this.value = value;
  }

  onChange: (value: string) => void = () => {};
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  onTouch: () => void = () => {};
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  disabled = false;
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}