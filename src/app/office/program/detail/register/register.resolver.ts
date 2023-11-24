/** @format */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { Observable } from "rxjs";
import { ProgramService } from "@office/program/services/program.service";
import { ProgramDataSchema } from "@office/program/models/program.model";

export const ProgramRegisterResolver: ResolveFn<ProgramDataSchema> = (
  route: ActivatedRouteSnapshot
): Observable<ProgramDataSchema> => {
  const programService = inject(ProgramService);

  return programService.getDataSchema(route.params["programId"]);
};
