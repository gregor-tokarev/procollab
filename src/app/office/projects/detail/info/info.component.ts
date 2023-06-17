/** @format */

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, noop, Observable } from "rxjs";
import { Project } from "@models/project.model";
import { IndustryService } from "@services/industry.service";
import { NavService } from "@services/nav.service";
import { Vacancy } from "@models/vacancy.model";
import { AuthService } from "@auth/services";
import { ProjectNewsService } from "@office/projects/detail/services/project-news.service";
import { ProjectNews } from "@office/projects/models/project-news.model";
import { containerSm } from "@utils/responsive";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-detail",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"],
})
export class ProjectInfoComponent implements OnInit, AfterViewInit {
  constructor(
    private readonly route: ActivatedRoute,
    public readonly industryService: IndustryService,
    public readonly authService: AuthService,
    private readonly navService: NavService,
    private readonly projectNewsService: ProjectNewsService,
    private readonly fb: FormBuilder
  ) {
    this.newsForm = this.fb.group({
      text: ["", [Validators.required]],
    });
  }

  project$?: Observable<Project> = this.route.parent?.data.pipe(map(r => r["data"]));

  vacancies$: Observable<Vacancy[]> = this.route.data.pipe(map(r => r["data"]));

  ngOnInit(): void {
    this.navService.setNavTitle("Профиль проекта");

    this.projectNewsService.fetchNews(this.route.snapshot.params.projectId).subscribe(news => {
      this.news = news;

      setTimeout(() => {
        const observer = new IntersectionObserver(this.onNewsInVew.bind(this), {
          root: document.querySelector(".office__body"),
          rootMargin: "0px 0px 0px 0px",
          threshold: 0,
        });
        document.querySelectorAll(".news__item").forEach(e => {
          observer.observe(e);
        });
      });
    });
  }

  @ViewChild("newsEl") newsEl?: ElementRef;
  @ViewChild("contentEl") contentEl?: ElementRef;
  ngAfterViewInit(): void {
    if (containerSm < window.innerWidth) {
      this.contentEl?.nativeElement.append(this.newsEl?.nativeElement);
    }
  }

  onNewsInVew(entries: IntersectionObserverEntry[], _observer: IntersectionObserver): void {
    const ids = entries.map(e => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return e.target.dataset.id;
    });

    this.projectNewsService.readNews(this.route.snapshot.params.projectId, ids).subscribe(noop);
  }

  news: ProjectNews[] = [];

  readFull = false;

  newsForm: FormGroup;

  onAddNews(news: ProjectNews): void {
    this.news.unshift(news);
  }

  onDeleteNews(newsId: number): void {
    const newsIdx = this.news.findIndex(n => n.id === newsId);
    this.news.splice(newsIdx, 1);

    this.projectNewsService
      .delete(this.route.snapshot.params.projectId, newsId)
      .subscribe(() => {});
  }
}
