/** @format */

import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ChatMessage } from "@models/chat-message.model";
import { filter, map, noop, Observable, Subscription, tap, throttleTime } from "rxjs";
import { Project } from "@models/project.model";
import { NavService } from "@services/nav.service";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "@auth/services";
import { ModalService } from "@ui/models/modal.service";
import { ChatService } from "@services/chat.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ProjectChatComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private readonly navService: NavService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly modalService: ModalService,
    private readonly chatService: ChatService
  ) {
    this.messageForm = this.fb.group({
      messageControl: [{ text: "" }],
    });
  }

  ngOnInit(): void {
    this.navService.setNavTitle("Чат проекта");

    const projectSub$ = this.route.data.pipe(map(r => r["data"])).subscribe(project => {
      this.project = project;
    });
    projectSub$ && this.subscriptions$.push(projectSub$);

    const chatSub$ = this.chatService.connect().subscribe(() => {
      console.debug("Chat websocket connected from ProjectChatComponent");

      this.initTypingEvent();
      this.initMessageEvent();
      this.initEditEvent();
    });
    chatSub$ && this.subscriptions$.push(chatSub$);

    this.initTypingSend();

    this.chatService
      .loadMessage(Number(this.route.parent?.snapshot.paramMap.get("projectId")))
      .subscribe(loadMessages => {
        this.messages = loadMessages.results;
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.viewport?.scrollToIndex(9999999);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach($ => $.unsubscribe());
  }

  subscriptions$: Subscription[] = [];

  project?: Project;

  currentUserId$: Observable<number> = this.authService.profile.pipe(map(r => r["id"]));
  messageForm: FormGroup;

  @ViewChild(CdkVirtualScrollViewport) viewport?: CdkVirtualScrollViewport;

  messages: ChatMessage[] = [];

  editingMessage?: ChatMessage;
  replyMessage?: ChatMessage;

  membersOnlineCount = 3;

  private initTypingSend(): void {
    const messageControlSub$ = this.messageForm
      .get("messageControl")
      ?.valueChanges.pipe(
        throttleTime(2000),
        tap(() => {
          return this.chatService.startTyping({
            chatId: this.route.parent?.snapshot.paramMap.get("projectId") ?? "",
            chatType: "project",
          });
        })
      )
      .subscribe(noop);

    messageControlSub$ && this.subscriptions$.push(messageControlSub$);
  }

  typingPersons: Project["collaborators"] = [];

  private initTypingEvent(): void {
    const typingEvent$ = this.chatService
      .onTyping()
      .pipe(
        map(typingEvent =>
          this.project?.collaborators.find(
            collaborator => collaborator.userId === typingEvent.userId
          )
        ),
        filter(Boolean)
      )
      .subscribe(person => {
        if (!this.typingPersons.map(p => p.userId).includes(person.userId))
          this.typingPersons.push(person);

        setTimeout(() => {
          const personIdx = this.typingPersons.findIndex(p => p.userId === person.userId);

          this.typingPersons.splice(personIdx, 1);
        }, 2000);
      });

    typingEvent$ && this.subscriptions$.push(typingEvent$);
  }

  private initMessageEvent(): void {
    const messageEvent$ = this.chatService.onMessage().subscribe(message => {
      this.messages = [...this.messages, message];
    });

    messageEvent$ && this.subscriptions$.push(messageEvent$);
  }

  private initEditEvent(): void {
    const editEvent$ = this.chatService.onEditMessage().subscribe(message => {
      const messageIdx = this.messages.findIndex(msg => msg.id === message.id);
      this.messages = this.messages.splice(messageIdx, 1, message);
    });

    editEvent$ && this.subscriptions$.push(editEvent$);
  }

  onSubmitMessage(): void {
    if (this.editingMessage) {
      console.log(this.editingMessage);
      this.chatService.editMessage({
        message: this.editingMessage.text,
        messageId: this.editingMessage.id,
        chatType: "project",
        chatId: this.route.parent?.snapshot.paramMap.get("projectId") ?? "",
      });
    } else {
      this.chatService.sendMessage({
        replyTo: this.replyMessage?.id ?? null,
        message: this.messageForm.get("messageControl")?.value.text ?? "",
        chatType: "project",
        chatId: this.route.parent?.snapshot.paramMap.get("projectId") ?? "",
      });
    }
  }

  onInputResize(): void {
    if (this.viewport?.getOffsetToRenderedContentStart()) this.viewport?.scrollToIndex(99999);
  }

  onDeleteMessage(messageId: number): void {
    const deletedMessage = this.messages.find(message => message.id === messageId);

    this.modalService
      .confirmDelete("Вы уверены что хотите удалить сообщение?", `“${deletedMessage?.text}”`)
      .subscribe(noop);
  }

  onEditMessage(messageId: number): void {
    this.replyMessage = undefined;
    this.editingMessage = this.messages.find(message => message.id === messageId);
  }

  onReplyMessage(messageId: number): void {
    this.editingMessage = undefined;
    this.replyMessage = this.messages.find(message => message.id === messageId);
  }

  onCancelInput(): void {
    this.replyMessage = undefined;
    this.editingMessage = undefined;
  }
}
