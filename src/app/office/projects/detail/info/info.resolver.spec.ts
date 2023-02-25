/** @format */

import { TestBed } from "@angular/core/testing";

import { ProjectInfoResolver } from "./info.resolver";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from "rxjs";
import { AuthService } from "@auth/services";

describe("ProjectInfoResolver", () => {
  let resolver: ProjectInfoResolver;

  beforeEach(() => {
    const authSpy = {
      profile: of({}),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: authSpy }],
    });
    resolver = TestBed.inject(ProjectInfoResolver);
  });

  it("should be created", () => {
    expect(resolver).toBeTruthy();
  });
});