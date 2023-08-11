/** @format */

import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IndustryService } from "@services/industry.service";
import { concatMap, distinctUntilChanged, map, Observable, Subscription, tap } from "rxjs";
import { ErrorMessage } from "@error/models/error-message";
import { NavService } from "@services/nav.service";
import { Project } from "@models/project.model";
import { Vacancy } from "@models/vacancy.model";
import { ValidationService } from "@core/services";
import { VacancyService } from "@services/vacancy.service";
import { InviteService } from "@services/invite.service";
import { Invite } from "@models/invite.model";
import { ProjectService } from "@services/project.service";
import { SelectComponent } from "@ui/components";
import { ProgramService } from "@office/program/services/program.service";
import { ProgramTag } from "@office/program/models/program.model";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class ProjectEditComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly industryService: IndustryService,
    protected readonly projectService: ProjectService,
    private readonly navService: NavService,
    private readonly validationService: ValidationService,
    private readonly vacancyService: VacancyService,
    private readonly inviteService: InviteService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly programService: ProgramService
  ) {
    this.projectForm = this.fb.group({
      imageAddress: ["", [Validators.required]],
      name: ["", [Validators.required]],
      region: ["", [Validators.required]],
      step: [null, [Validators.required]],
      links: this.fb.array([]),
      industryId: [undefined, [Validators.required]],
      description: ["", [Validators.required]],
      presentationAddress: ["", [Validators.required]],
      partnerProgramId: [null],
      achievements: this.fb.array([]),
    });

    this.vacancyForm = this.fb.group({
      role: ["", [Validators.required]],
      requiredSkills: this.fb.array([]),
    });

    this.inviteForm = this.fb.group({
      role: ["", [Validators.required]],
      // eslint-disable-next-line
      link: [
        "",
        [
          Validators.required,
          Validators.pattern(/^http(s)?:\/\/.+(:[0-9]*)?\/office\/profile\/\d+$/),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.navService.setNavTitle("Создание проекта");
    const controls: (AbstractControl | null)[] = [
      this.inviteForm.get("role"),
      this.inviteForm.get("link"),
      this.vacancyForm.get("role"),
      this.vacancyForm.get("requiredSkills"),
    ];

    controls.filter(Boolean).forEach(control => {
      this.subscriptions.push(
        control?.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
          if (value === "") {
            control?.removeValidators([Validators.required]);
            control?.updateValueAndValidity();
          }
        })
      );
    });
  }

  ngAfterViewInit(): void {
    this.programService
      .programTags()
      .pipe(
        tap(tags => {
          this.programTags = tags;
        }),
        map(tags => tags.map(t => ({ label: t.name, value: t.id, id: t.id }))),
        tap(tags => {
          this.programTagsOptions = tags;
        }),
        concatMap(() => this.route.data),
        map(d => d["data"])
      )
      .subscribe(([project, vacancies, invites]: [Project, Vacancy[], Invite[]]) => {
        this.projectForm.patchValue({
          imageAddress: project.imageAddress,
          name: project.name,
          region: project.region,
          step: project.step,
          industryId: project.industry,
          description: project.description,
          presentationAddress: project.presentationAddress,
        });

        if (project.partnerProgramsTags?.length) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const tag = this.programTags.find(p => p.tag === project.partnerProgramsTags[0]);

          this.projectForm.patchValue({
            partnerProgramId: tag?.id,
          });
        }

        project.achievements &&
          project.achievements.forEach(achievement =>
            this.addAchievement(achievement.id, achievement.title, achievement.status)
          );

        project.links && project.links.forEach(l => this.addLink(l));

        this.vacancies = vacancies;

        this.invites = invites;

        this.cdRef.detectChanges();
      });
  }

  programTagsOptions: SelectComponent["options"] = [];
  programTags: ProgramTag[] = [];

  ngOnDestroy(): void {
    this.profile$?.unsubscribe();
    this.subscriptions.forEach($ => $?.unsubscribe());
  }

  /**
   * Current step of toggle, that navigates through
   * parts of project info
   */
  editingStep: "main" | "team" | "achievements" = "main";

  profile$?: Subscription;

  errorMessage = ErrorMessage;

  industries$ = this.industryService.industries.pipe(
    map(industries =>
      industries.map(industry => ({ value: industry.id, id: industry.id, label: industry.name }))
    )
  );

  projectSteps$: Observable<SelectComponent["options"]> = this.projectService.steps.pipe(
    map(steps => steps.map(step => ({ id: step.id, label: step.name, value: step.id })))
  );

  subscriptions: (Subscription | undefined)[] = [];

  vacancies: Vacancy[] = [];
  vacancyForm: FormGroup;

  requiredSkillTitle = "";

  addRequiredSkill(): void {
    if (!this.requiredSkillTitle) {
      return;
    }

    this.requiredSkills.push(this.fb.control(this.requiredSkillTitle ?? ""));
    this.requiredSkillTitle = "";
  }

  removeRequiredSkill(index: number): void {
    this.requiredSkills.removeAt(index);
  }

  get requiredSkills(): FormArray {
    return this.vacancyForm.get("requiredSkills") as FormArray;
  }

  vacancyIsSubmitting = false;

  submitVacancy(): void {
    if (!this.validationService.getFormValidation(this.vacancyForm)) {
      const controls = [this.vacancyForm.get("role"), this.vacancyForm.get("requiredSkills")];

      controls.filter(Boolean).forEach(control => {
        console.debug("Submit vacancy error: ", control);

        control?.addValidators([Validators.required]);
        control?.updateValueAndValidity({ emitEvent: false });
      });

      return;
    }

    this.vacancyIsSubmitting = true;

    this.vacancyService
      .postVacancy(Number(this.route.snapshot.paramMap.get("projectId")), this.vacancyForm.value)
      .subscribe({
        next: vacancy => {
          this.vacancies.push(vacancy);

          this.requiredSkills.clear();
          this.vacancyForm.reset();

          this.vacancyIsSubmitting = false;
        },
        error: () => {
          this.vacancyIsSubmitting = false;
        },
      });
  }

  removeVacancy(vacancyId: number): void {
    if (!confirm("Вы точно хотите удалить вакансию?")) {
      return;
    }

    this.vacancyService.deleteVacancy(vacancyId).subscribe(() => {
      const index = this.vacancies.findIndex(vacancy => vacancy.id === vacancyId);
      this.vacancies.splice(index, 1);
    });
  }

  inviteForm: FormGroup;
  inviteFormIsSubmitting = false;

  invites: Invite[] = [];

  submitInvite(): void {
    if (!this.validationService.getFormValidation(this.inviteForm)) {
      const controls = [this.inviteForm.get("role"), this.inviteForm.get("link")];

      controls.filter(Boolean).forEach(control => {
        console.debug("Submit invite error: ", control);

        control?.addValidators([Validators.required]);
        control?.updateValueAndValidity({ emitEvent: false });
      });

      return;
    }

    this.inviteFormIsSubmitting = true;

    const link = new URL(this.inviteForm.get("link")?.value);

    // Sure that it's works because of regex validation
    const path = link.pathname.split("/");
    this.inviteService
      .sendForUser(
        Number(path[path.length - 1]),
        Number(this.route.snapshot.paramMap.get("projectId")),
        this.inviteForm.value.role
      )
      .subscribe({
        next: invite => {
          this.inviteFormIsSubmitting = false;
          this.inviteForm.reset();

          this.invites.push(invite);
        },
        error: () => {
          this.inviteFormIsSubmitting = false;
        },
      });
  }

  removeInvitation(invitationId: number): void {
    this.inviteService.revokeInvite(invitationId).subscribe(() => {
      const index = this.invites.findIndex(invite => invite.id === invitationId);
      this.invites.splice(index, 1);
    });
  }

  projectForm: FormGroup;
  projectFormIsSubmitting = false;

  get achievements(): FormArray {
    return this.projectForm.get("achievements") as FormArray;
  }

  addAchievement(id?: number, title?: string, status?: string): void {
    const formGroup = this.fb.group({
      title: [title ?? "", [Validators.required]],
      status: [status ?? "", [Validators.required]],
      id: [id],
    });

    this.achievements.push(formGroup);
  }

  removeAchievement(index: number): void {
    this.achievements.removeAt(index);
  }

  saveProject(): void {
    if (!this.validationService.getFormValidation(this.projectForm)) {
      return;
    }

    this.projectFormIsSubmitting = true;

    this.projectService
      .updateProject(Number(this.route.snapshot.paramMap.get("projectId")), this.projectForm.value)
      .subscribe({
        next: () => {
          this.projectFormIsSubmitting = false;
          this.router
            .navigateByUrl(`/office/projects/my`)
            .then(() => console.debug("Route changed from ProjectEditComponent"));
        },
        error: () => {
          this.projectFormIsSubmitting = false;
        },
      });
  }

  get links(): FormArray {
    return this.projectForm.get("links") as FormArray;
  }

  newLink = "";

  addLink(title?: string): void {
    const fromState = title ?? this.newLink;

    const control = this.fb.control(fromState, [Validators.required]);
    this.links.push(control);

    this.newLink = "";
  }

  removeLink(i: number): void {
    this.links.removeAt(i);
  }
}
