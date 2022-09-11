/** @format */

import { Injectable } from "@angular/core";
import { ApiService } from "../../core/services";
import { map, Observable, ReplaySubject, tap } from "rxjs";
import {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from "../models/http.model";
import { plainToClass } from "class-transformer";
import { Tokens } from "../models/tokens.model";
import { User } from "../models/user.model";

@Injectable()
export class AuthService {
  constructor(private apiService: ApiService) {}

  login({ email, password }: LoginRequest): Observable<LoginResponse> {
    return this.apiService
      .post("/auth/login", { email, password })
      .pipe(map(json => plainToClass(LoginResponse, json)));
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.apiService
      .post("/auth/register", data)
      .pipe(map(json => plainToClass(RegisterResponse, json)));
  }

  refreshTokens(): Observable<RefreshResponse> {
    return this.apiService
      .post("/auth/refresh-tokens", { refreshToken: localStorage.getItem("refreshToken") })
      .pipe(map(json => plainToClass(RefreshResponse, json)));
  }

  getTokens(): Tokens | null {
    const accessToken =
      localStorage.getItem("accessToken") ?? sessionStorage.getItem("accessToken");
    const refreshToken =
      localStorage.getItem("refreshToken") ?? sessionStorage.getItem("refreshToken");
    const tokenType = localStorage.getItem("tokenType");

    if (!accessToken || !refreshToken || !tokenType) {
      return null;
    }

    return { accessToken, refreshToken, tokenType };
  }

  clearTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  memTokens(tokens: Tokens, session = false): void {
    if (!session) {
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("tokenType", tokens.tokenType);
      localStorage.setItem("refreshToken", tokens.refreshToken);
    } else {
      sessionStorage.setItem("accessToken", tokens.accessToken);
      sessionStorage.setItem("tokenType", tokens.tokenType);
      sessionStorage.setItem("refreshToken", tokens.refreshToken);
    }
  }

  private profile$ = new ReplaySubject<User>(1);
  profile = this.profile$.asObservable();

  getProfile(): Observable<User> {
    return this.apiService.get<User>("/profile/").pipe(
      map(user => plainToClass(User, user)),
      tap(profile => this.profile$.next(profile))
    );
  }

  getUser(id: number): Observable<User> {
    return this.apiService.get<User>(`/profile/${id}`).pipe(map(user => plainToClass(User, user)));
  }

  saveProfile(newProfile: Partial<User>): Observable<string> {
    return this.apiService.put<string>("/profile/update", newProfile);
  }
}
