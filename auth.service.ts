import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { OAuthResponse } from './oauthreponse.interface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Globals } from '../globals.config';

/**
 * Service responsible for handling authentication operations throughout the application
 * Manages user authentication, token refresh/validation, and HTTP request authorization
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  /**
   * Authenticates user with provided credentials against the API
   * @param username User's login identifier
   * @param password User's password
   * @returns Observable containing the authentication response
   */
  authenticateUser(username: string, password: string) {
    var response = this.http.post<OAuthResponse>(
      Globals.apiUrl + '/auth/login',
      {
        Username: username,
        Password: password,
      }
    );
    return response;
  }

  /**
   * Checks if user is already logged in and redirects to appropriate page
   * Called during application initialization to handle persistent sessions
   */
  autoLogin() {
    if (this.cookieService.get('is_loggedin') === 'yes') {
      this.router.navigate(['/public/service-request']);
      return;
    }
    return;
  }

  /**
   * Logs out the current user by clearing authentication cookies
   * Reloads the application to ensure clean state
   */
  logoutUser() {
    this.cookieService.delete('is_loggedin', '/');
    this.cookieService.delete('logged_user', '/');
    this.cookieService.delete('role', '/');
    this.cookieService.delete('access_token', '/');
    this.cookieService.delete('refresh_token', '/');
    // this.router.navigate(['/auth']);
    window.location.reload();
  }

  /**
   * Performs authenticated GET request with automatic token refresh on 401
   * @param uri API endpoint path (without base URL)
   * @param closure Callback function to handle the response with signature (statusCode, data)
   */
  GetRequest(uri: string, closure: Function) {
    this.http
      .get(Globals.apiUrl + uri, this.ReturnHttpHeaders())
      .pipe(
        map((response) => {
          closure(200, response);
        }),
        catchError((error) => {
          if (error.status == 401) {
            return this.RefreshToken().pipe(
              switchMap(() =>
                this.http.get(Globals.apiUrl + uri, this.ReturnHttpHeaders())
              ),
              map((response) => {
                closure(200, response);
              }),
              catchError((refreshError) => {
                closure(refreshError.status, refreshError.error);
                return of(null);
              })
            );
          } else {
            closure(error.status, error.error.message);
            return of(null);
          }
        })
      )
      .subscribe();
  }

  /**
   * Performs authenticated POST request with automatic token refresh on 401
   * @param uri API endpoint path (without base URL)
   * @param payload Data to be sent in the request body
   * @param closure Callback function to handle the response with signature (statusCode, data)
   */
  PostRequest(uri: string, payload: any, closure: Function) {
    this.http
      .post(Globals.apiUrl + uri, payload, this.ReturnHttpHeaders())
      .pipe(
        map((response) => {
          closure(200, response);
        }),
        catchError((error) => {
          if (error.status == 401) {
            return this.RefreshToken().pipe(
              switchMap(() =>
                this.http.post(
                  Globals.apiUrl + uri,
                  payload,
                  this.ReturnHttpHeaders()
                )
              ),
              map((response) => {
                closure(200, response);
              }),
              catchError((refreshError) => {
                closure(refreshError.status, refreshError.error);
                return of(null);
              })
            );
          } else {
            closure(error.status, error.error.message);
            return of(null);
          }
        })
      )
      .subscribe();
  }

  /**
   * Performs POST request specifically for downloading files (Excel format)
   * Opens the downloaded file in a new browser tab
   * @param uri API endpoint path (without base URL)
   * @param payload Data to be sent in the request body
   */
  PostDownload(uri: string, payload: any) {
    this.http
      .post(Globals.apiUrl + uri, payload, {
        responseType: 'blob',
        headers: {
          Accept:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      })
      .pipe(
        map((response) => {
          let blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          let url = window.URL.createObjectURL(blob);
          window.open(url);
        }),
        catchError((error) => {
          console.log(error);
          return of(null);
        })
      );
  }

  /**
   * Performs authenticated DELETE request with automatic token refresh on 401
   * @param uri API endpoint path (without base URL)
   * @param closure Callback function to handle the response with signature (statusCode, data)
   */
  DeleteRequest(uri: string, closure: Function) {
    this.http
      .delete(Globals.apiUrl + uri, this.ReturnHttpHeaders())
      .pipe(
        map((response) => {
          closure(200, response);
        }),
        catchError((error) => {
          if (error.status == 401) {
            return this.RefreshToken().pipe(
              switchMap(() =>
                this.http.delete(Globals.apiUrl + uri, this.ReturnHttpHeaders())
              ),
              map((response) => {
                closure(200, response);
              }),
              catchError((refreshError) => {
                closure(refreshError.status, refreshError.error);
                return of(null);
              })
            );
          } else {
            closure(error.status, error.error.message);
            return of(null);
          }
        })
      )
      .subscribe();
  }

  /**
   * Performs authenticated PUT request with automatic token refresh on 401
   * @param uri API endpoint path (without base URL)
   * @param payload Data to be sent in the request body
   * @param closure Callback function to handle the response with signature (statusCode, data)
   */
  PutRequest(uri: string, payload: any, closure: Function) {
    this.http
      .put(Globals.apiUrl + uri, payload, this.ReturnHttpHeaders())
      .pipe(
        map((response) => {
          closure(200, response);
        }),
        catchError((error) => {
          if (error.status == 401) {
            return this.RefreshToken().pipe(
              switchMap(() =>
                this.http.put(
                  Globals.apiUrl + uri,
                  payload,
                  this.ReturnHttpHeaders()
                )
              ),
              map((response) => {
                closure(200, response);
              }),
              catchError((refreshError) => {
                closure(refreshError.status, refreshError.error);
                return of(null);
              })
            );
          } else {
            closure(error.status, error.error.message);
            return of(null);
          }
        })
      )
      .subscribe();
  }

  /**
   * Attempts to refresh the authentication tokens using the current refresh token
   * Updates cookies with new tokens on success
   * Redirects to error pages on authentication failures
   * @returns Observable that completes after token refresh attempt
   */
  RefreshToken() {
    var cookieExpiry = new Date();
    cookieExpiry.setDate(cookieExpiry.getDate() + 30);

    return this.http
      .post<OAuthResponse>(Globals.apiUrl + '/auth/refresh-token', {
        Username: this.cookieService.get('logged_user'),
        RefreshToken: this.cookieService.get('refresh_token'),
      })
      .pipe(
        map((response) => {
          this.cookieService.set(
            'access_token',
            response.access_token,
            cookieExpiry,
            '/'
          );
          this.cookieService.set(
            'refresh_token',
            response.refresh_token,
            cookieExpiry,
            '/'
          );
        }),
        catchError((error) => {
          if (error.status == 401) {
            this.logoutUser();
            this.router.navigate(['/401']);
          } else {
            this.router.navigate(['/400']);
          }
          return of(null);
        })
      );
  }

  /**
   * Creates HTTP header configuration with the current authentication token
   * Used for all authenticated API requests
   * @returns HttpHeaders configuration object with authentication
   */
  ReturnHttpHeaders() {
    const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.cookieService.get('access_token'),
      }),
    };
    return httpOptions;
  }
}
