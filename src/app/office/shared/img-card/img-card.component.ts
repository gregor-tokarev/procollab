/** @format */

import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { IconComponent } from "@ui/components";
import { NgIf, NgOptimizedImage } from "@angular/common";

@Component({
  selector: "app-img-card",
  templateUrl: "./img-card.component.html",
  styleUrl: "./img-card.component.scss",
  standalone: true,
  imports: [NgIf, IconComponent, NgOptimizedImage],
})
export class ImgCardComponent implements OnInit {
  constructor() {}

  @Input() src = "";
  @Input() error = false;
  @Input() loading = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();
  ngOnInit(): void {}
}
