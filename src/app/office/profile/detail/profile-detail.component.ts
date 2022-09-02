/** @format */

import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, pluck } from "rxjs";
import { User } from "../../../auth/models/user.model";
import { NavService } from "../../services/nav.service";

@Component({
  selector: "app-profile-detail",
  templateUrl: "./profile-detail.component.html",
  styleUrls: ["./profile-detail.component.scss"],
})
export class ProfileDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute, private navService: NavService) {}

  user: Observable<User> = this.route.data.pipe(pluck("data"));

  ngOnInit(): void {
    this.navService.setNavTitle("Профиль");
  }
}