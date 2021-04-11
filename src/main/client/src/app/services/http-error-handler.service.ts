import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { HttpError } from '../models/HttpError';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {

  constructor() { }

  handleError(error: HttpErrorResponse) {

    const errorResponse = {} as HttpError

    if (error.error instanceof ErrorEvent) {
      //Client side errors
      errorResponse.error_message = `An error occurred: ${error.error.message}. ` + `Please refresh the page and try again.`;
    } else {
      //Server side errors
      errorResponse.error_message = `Server returned error code ${error.status}. ` + `Please refresh the page and try again.`;
      errorResponse.status_code = error.status
      errorResponse.error_body = error.error
      //Validation errors
      if(error.error.errors !== undefined){
        errorResponse.errors = error.error.errors
      }
    }

    //Show error in console
    console.error(errorResponse);

    return of ( errorResponse );
  }

}
