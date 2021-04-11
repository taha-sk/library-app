import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { Book } from '../models/Book';

import { BooksService } from './books.service';

describe('BooksService', () => {
  let service: BooksService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(BooksService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get root', () => {
    const testData = { _links: {books: { href: "link"}}};

    service.getRoot("/root").subscribe((data:any) => {
      expect(data._links.books.href).toEqual("link");
    });

    const req = httpTestingController.expectOne("/root");
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  });

  it('should get books', () => {
    const testData = { _embedded: [{title:"title", author:"author"} as Book]};

    service.getBooks("/getBooks").subscribe((data:any) => {
      expect(data._embedded[0].title).toEqual("title");
      expect(data._embedded[0].author).toEqual("author");
    });

    const req = httpTestingController.expectOne("/getBooks");
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  });

  it('should create book', () => {
    const testData = {title:"title", author:"author"} as Book;

    service.createBook("/createBook", testData).subscribe((data:any) => {
      expect(data.title).toEqual("title");
      expect(data.author).toEqual("author");
    });

    const req = httpTestingController.expectOne("/createBook");
    expect(req.request.method).toEqual('POST');
    req.flush(testData);
  });

  it('should update book', () => {
    const testData = {title:"title", author:"author"} as Book;

    service.updateBook("/updateBook/1", testData).subscribe((data:any) => {
      expect(data.title).toEqual("title");
      expect(data.author).toEqual("author");
    });

    const req = httpTestingController.expectOne("/updateBook/1");
    expect(req.request.method).toEqual('PUT');
    req.flush(testData);
  });

  it('should delete book', () => {

    service.deleteBook("/deleteBook/1").subscribe((data:any) => {
      expect(data).toEqual({});
    });

    const req = httpTestingController.expectOne("/deleteBook/1");
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  afterEach(() => {
    httpTestingController.verify();
  });

});
