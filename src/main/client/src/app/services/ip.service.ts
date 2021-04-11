import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IpService {

  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService
    ) { }

  getIp(){
    return this.http.get<{ip:string}>("https://api.ipify.org/?format=json")
    .pipe(
      catchError(this.httpErrorHandler.handleError)
    );
  }

}
