/** @format */

import { ResolveFn } from "@angular/router";
import { inject } from "@angular/core";
import { TaskService } from "./services/task.service";
import { TaskStepsResponse } from "../../models/skill.model";

export const taskDetailResolver: ResolveFn<TaskStepsResponse> = (route, state) => {
  const taskService = inject(TaskService);

  return taskService.getSteps(route.params["taskId"]);
};
