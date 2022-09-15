/** @format */

import { Injectable } from "@angular/core";
import { ApiService } from "../../core/services";
import { map, Observable } from "rxjs";
import { plainToClass } from "class-transformer";
import { Invite } from "../models/invite.model";

@Injectable({
  providedIn: "root",
})
export class InviteService {
  constructor(private apiService: ApiService) {}

  sendForUser(userId: number, projectId: number): Observable<Invite> {
    return this.apiService
      .post("/invite/send", { userId, projectId })
      .pipe(map(profile => plainToClass(Invite, profile)));
  }

  revokeInvite(invitationId: number): Observable<Invite> {
    return this.apiService.delete(`/invite/revoke/${invitationId}`);
  }

  acceptInvite(inviteId: number): Observable<Invite> {
    return this.apiService.post(`/invite/accept/${inviteId}`, {});
  }

  rejectInvite(inviteId: number): Observable<Invite> {
    return this.apiService.post(`/invite/reject/${inviteId}`, {});
  }

  getMy(): Observable<Invite[]> {
    return this.apiService
      .get<Invite[]>("/invite/my/")
      .pipe(map(invites => plainToClass(Invite, invites)));
  }

  getByProject(projectId: number): Observable<Invite[]> {
    return this.apiService
      .get<Invite[]>(`/invite/all/${projectId}`)
      .pipe(map(profiles => plainToClass(Invite, profiles)));
  }
}