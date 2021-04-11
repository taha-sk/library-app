import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CaptchaRequest } from '../models/CaptchaRequest';
import { CaptchaResponse } from '../models/CaptchaResponse';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from './http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {

  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService
    ) { }

  validateCaptcha(request: CaptchaRequest){
    return this.http.post<CaptchaResponse>("/api/validateCaptcha", request)
    .pipe(
      catchError(this.httpErrorHandler.handleError)
    );
  }

}
