/** @format */

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { ProgramService } from "@office/program/services/program.service";
import { Project } from "@models/project.model";

@Injectable({
  providedIn: "root",
})
export class ProgramProjectsResolver implements Resolve<Project[]> {
  constructor(private readonly programService: ProgramService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Project[]> {
    return this.programService.getAllProjects(route.parent?.params["programId"]);
  }
}