/** @format */

import { Component, inject, Input, signal, EventEmitter, Output, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "@ui/components";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { IconComponent } from "@uilib";
import { PersonalRatingCardComponent } from "../personal-rating-card/personal-rating-card.component";
import { ModalComponent } from "@ui/components/modal/modal.component";
import { SkillService } from "../../../skills/services/skill.service";
import { Skill } from "projects/skills/src/models/skill.model";
import { PersonalSkillCardComponent } from "../personal-skill-card/personal-skill-card.component";

@Component({
  selector: "app-skill-chooser",
  standalone: true,
  imports: [CommonModule, PersonalRatingCardComponent, ButtonComponent, ModalComponent, RouterLink, IconComponent, PersonalSkillCardComponent],
  templateUrl: "./skill-chooser.component.html",
  styleUrl: "./skill-chooser.component.scss",
})
export class SkillChooserComponent implements OnInit {
  @Input() open = false;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();

  route = inject(ActivatedRoute);
  skillService = inject(SkillService);

  skillsList = signal<Skill[]>([]);

  ngOnInit(): void {
    this.skillService.getAll().subscribe(r => {
      this.skillsList.set(r.results);
    })
  }

  onOpenChange(event: boolean) {
    this.openChange.emit(event);
  }

  onCloseModal() {
    this.openChange.emit(false);
  }
}
