/** @format */

import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { ChatDirectService } from "@office/chat/services/chat-direct.service";
import { ChatListItem } from "@office/chat/models/chat-item.model";

@Injectable({
  providedIn: "root",
})
export class ChatResolver implements Resolve<ChatListItem[]> {
  constructor(private readonly chatDirectService: ChatDirectService) {}

  resolve(): Observable<ChatListItem[]> {
    return this.chatDirectService.getDirects();
  }
}