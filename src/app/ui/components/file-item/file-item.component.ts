/** @format */
import { Component, Input, OnInit } from "@angular/core";
import { getFormattedFileSize } from "@utils/formatted-file-size";
@Component({
  selector: "app-file-item",
  templateUrl: "./file-item.component.html",
  styleUrls: ["./file-item.component.scss"],
})
export class FileItemComponent implements OnInit {
  constructor() {}

  @Input() type?: string;
  @Input() name = "";
  @Input() size = 0;
  @Input() link = "";

  getFormattedFileSize = getFormattedFileSize;
  ngOnInit(): void {}

  fileMap: Record<string, { size: number; name: string }> = {
    pdf: {
      size: 24,
      name: "file_pdf",
    },
    doc: {
      size: 24,
      name: "file_doc",
    },
  };

  onDownloadFile(): void {
    const link = document.createElement("a");

    link.href = this.link;
    link.setAttribute("download", this.name);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
