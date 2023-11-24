/** @format */

import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { Project } from "@models/project.model";
import { ProjectService } from "@services/project.service";
import { ApiPagination } from "@models/api-pagination.model";
import { HttpParams } from "@angular/common/http";
import { ResolveFn } from "@angular/router";

export const ProjectsMyResolver: ResolveFn<ApiPagination<Project>> = (): Observable<
  ApiPagination<Project>
> => {
  const projectService = inject(ProjectService);

  return projectService.getMy(new HttpParams({ fromObject: { limit: 16 } }));
};
