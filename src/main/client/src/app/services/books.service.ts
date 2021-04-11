import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HMRoot } from '../models/HMRoot';
import { HMPagination } from '../models/HMPagination';
import { Book } from '../models/Book';
import { HttpErrorHandlerService } from './http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService
    ) { }

  getRoot(rootPath: string){
    return this.http.get<HMRoot>(rootPath)
    .pipe(
      catchError(this.httpErrorHandler.handleError)
    );
  }

  getBooks(booksPath: string, options?: {params:HttpParams}){
    return this.http.get<HMPagination>(booksPath, options)
    .pipe(
      catchError(this.httpErrorHandler.handleError)
    );
  }

  createBook(booksPath: string, book: Book){
    return this.http.post<Book>(booksPath, book)
    .pipe(
      catchError(this.httpErrorHandler.handleError)
    );
  }

  updateBook(bookPath: string, book: Book){
    return this.http.put<Book>(bookPath, book)
    .pipe(
      catchError(this.httpErrorHandler.handleError)
    );
  }

  deleteBook(bookPath: string){
    return this.http.delete(bookPath)
    .pipe(
      catchError(this.httpErrorHandler.handleError)
    );
  }

}
