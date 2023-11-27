/** @format */

import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-switch",
  templateUrl: "./switch.component.html",
  styleUrl: "./switch.component.scss",
})
export class SwitchComponent implements OnInit {
  @Input() checked = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  ngOnInit(): void {}
}
