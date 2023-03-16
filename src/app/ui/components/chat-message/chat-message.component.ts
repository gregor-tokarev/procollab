/** @format */

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { ChatMessage } from "@models/chat-message.model";
import { SnackbarService } from "@ui/services/snackbar.service";
import { DomPortal } from "@angular/cdk/portal";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";

@Component({
  selector: "app-chat-message",
  templateUrl: "./chat-message.component.html",
  styleUrls: ["./chat-message.component.scss"],
})
export class ChatMessageComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private readonly elRef: ElementRef,
    private readonly snackbarService: SnackbarService,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly overlay: Overlay
  ) {}

  @Input() chatMessage!: ChatMessage;

  @Output() reply = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
    });
    this.portal = new DomPortal(this.contextMenu);
  }

  ngOnDestroy(): void {
    this.overlayRef?.detach();
  }

  @ViewChild("contextMenu") contextMenu!: ElementRef<HTMLUListElement>;

  private overlayRef?: OverlayRef;
  private portal?: DomPortal;

  isOpen = false;

  onOpenContextmenu(event: MouseEvent) {
    event.preventDefault();

    this.isOpen = true;

    const contextMenuHeight = this.contextMenu.nativeElement.offsetHeight;

    const positionX = event.clientX;
    const positionY =
      contextMenuHeight + event.clientY > window.innerHeight
        ? event.clientY - contextMenuHeight
        : event.clientY;

    const positionStrategy = this.overlay
      .position()
      .global()
      .left(positionX + "px")
      .top(positionY + "px");
    this.overlayRef?.updatePositionStrategy(positionStrategy);

    !this.overlayRef?.hasAttached() && this.overlayRef?.attach(this.portal);

    this.contextMenu.nativeElement.focus();
  }

  onCloseContextmenu() {
    this.isOpen = false;
    this.overlayRef?.detach();
  }

  onClickContextmenu(event: MouseEvent) {
    event.stopPropagation();
  }

  onCopyContent(event: MouseEvent) {
    event.stopPropagation();

    this.isOpen = false;
    this.overlayRef?.detach();

    navigator.clipboard.writeText(this.chatMessage.text).then(() => {
      this.snackbarService.success("Сообщение скопированно");
      console.debug("Text copied in ChatMessageComponent");
    });
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();

    this.delete.emit(this.chatMessage.id);

    this.isOpen = false;
    this.overlayRef?.detach();
  }

  onReply(event: MouseEvent) {
    event.stopPropagation();

    this.reply.emit(this.chatMessage.id);

    this.isOpen = false;
    this.overlayRef?.detach();
  }

  onEdit(event: MouseEvent) {
    event.stopPropagation();

    this.edit.emit(this.chatMessage.id);

    this.isOpen = false;
    this.overlayRef?.detach();
  }
}
