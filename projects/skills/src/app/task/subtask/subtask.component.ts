/** @format */

import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VideoTaskComponent } from "../shared/video-task/video-task.component";
import { RadioSelectTaskComponent } from "../shared/radio-select-task/radio-select-task.component";
import { RelationsTaskComponent } from "../shared/relations-task/relations-task.component";
import { ButtonComponent } from "@ui/components";

@Component({
  selector: "app-subtask",
  standalone: true,
  imports: [
    CommonModule,
    VideoTaskComponent,
    RadioSelectTaskComponent,
    RelationsTaskComponent,
    ButtonComponent,
  ],
  templateUrl: "./subtask.component.html",
  styleUrl: "./subtask.component.scss",
})
export class SubtaskComponent {
  taskType = signal<"video" | "relations" | "radio-select">("radio-select");
}
