import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HMRoot } from '../models/HMRoot';
import { BooksService } from '../services/books.service';
import { of } from 'rxjs';

import { BookListComponent } from './book-list.component';
import { HMPagination } from '../models/HMPagination';
import { Book } from '../models/Book';
import { HttpError } from '../models/HttpError';
import { ReactiveFormsModule } from '@angular/forms';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;

  //Services
  let booksService: BooksService;
  let modalService: NgbModal;

  //BooksServiceStub for test
  let booksServiceStub: Partial<BooksService>;
  let modalServiceStub: Partial<NgbModal>;

  beforeEach(async () => {
    booksServiceStub = {
      getRoot(path: string){
        const result = { _links : { books: { href : "/books"}}} as HMRoot;
        return of (result);
      },
      getBooks(path: string, options?: any){
        const result = { _embedded : { books : []} } as HMPagination;
        return of ( result );
      },
      createBook(path: string, book: Book){
        return of ( book );
      },
      updateBook(path: string, book: Book){
        return of ( book );
      },
      deleteBook(path: string){
        return of ( {} );
      }
    };
    modalServiceStub = {
      open(content: any){
       return { componentInstance : { urlPath:"", book:{}, action: ""}, result: new Promise<any>(() => ("closed"))} as NgbModalRef;
      }
    };
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ BookListComponent ],
      providers: [ { provide: BooksService, useValue: booksServiceStub }, { provide: NgbModal, useValue: modalServiceStub } ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    booksService = TestBed.inject(BooksService);
    modalService = TestBed.inject(NgbModal);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  //Default condition from stub
  it('should create correct booksPath without Params and show No Books Found', () => {
    fixture.detectChanges();
    expect(component.booksPath).toEqual("/books");
    expect(component.pageSize.value).toEqual("5");
    expect(component.errorResponse).not.toBeDefined();
    expect(component.titleDirection).toEqual("");
    expect(component.authorDirection).toEqual("");
    expect(component.booksPaginated._embedded.books).toEqual([]); //Empty Book List
    const addBookBtn = fixture.nativeElement.querySelector('#addBookBtn');
    expect(addBookBtn.textContent).toContain("Add Book"); // Add Btn Exists
    const element = fixture.nativeElement.querySelector('.alert-primary');
    expect(element.textContent).toBe("No books found. You can add new book by clicking Add Book button!");
  });

  it('should create correct booksPath with Params', () => {
    booksService.getRoot = (path: string) =>  of ( { _links : { books: { href : "/books{}"}}} as HMRoot );
    fixture.detectChanges();
    expect(component.booksPath).toEqual("/books");
  });

  it('should show Error in getRoot with Error Response', () => {
    booksService.getRoot = (path: string) =>  of ( { error_message : "Nasty Error" } as HttpError );
    fixture.detectChanges();
    expect(component.booksPath).not.toBeDefined();
    const element = fixture.nativeElement.querySelector('.alert-danger');
    expect(element.textContent).toBe("Nasty Error");
  });

  it('should show Error in getBooks with Error Response', () => {
    booksService.getBooks = (path: string, options?: any) =>  of ( { error_message : "Get Books Error" } as HttpError );
    fixture.detectChanges();
    expect(component.booksPath).toBeDefined();
    const element = fixture.nativeElement.querySelector('.alert-danger');
    expect(element.textContent).toBe("Get Books Error");
  });

  it('should create correct table with Books[2]', () => {
    booksService.getBooks = (path: string, options?: any) =>  of ( { _embedded : { books : [{title:"a",author:"aa",_links:{self:{href:"/linka"}}},{title:"b",author:"ba",_links:{self:{href:"/linkb"}}}]}, _links : {}, page: { number: 0, totalPages: 1} } as HMPagination );
    fixture.detectChanges();
    const tdRowNo = fixture.nativeElement.querySelector('[scope=row]'); //Row No
    expect(tdRowNo.textContent).toBe("1");
    const tdBookTitle = fixture.nativeElement.querySelector('#rowBookTitle'); //Book Title
    expect(tdBookTitle.textContent).toBe("a");
    const tdBookAuthor = fixture.nativeElement.querySelector('#rowBookAuthor'); //Book Author
    expect(tdBookAuthor.textContent).toBe("aa");
    const tdUpdateBookBtn = fixture.nativeElement.querySelector('#updateBookBtn');
    expect(tdUpdateBookBtn.textContent).toBe("Update"); // Update Btn Exists
    const tdDeleteBookBtn = fixture.nativeElement.querySelector('#deleteBookBtn');
    expect(tdDeleteBookBtn.textContent).toBe("Delete"); // Update Btn Exists
    expect(component.booksPaginated._embedded.books).toHaveSize(2); // Book size
  });

  it('should create correct pagination with Books[2]', () => {
    booksService.getBooks = (path: string, options?: any) =>  of ( { _embedded : { books : [{title:"a",author:"aa",_links:{self:{href:"/linka"}}},{title:"b",author:"ba",_links:{self:{href:"/linkb"}}}]}, _links : {first:{href:"/linkFirst"}, next:{href:"/linkPrev"}}, page: { number: 0, totalPages: 1} } as HMPagination );
    fixture.detectChanges();
    const pageOf = fixture.nativeElement.querySelector('li > div'); //Pagination Info
    expect(pageOf.textContent).toBe("Page 1 of 1");
    const pageFirstLink = fixture.nativeElement.querySelector('#pageFirstLink');
    expect(pageFirstLink.className).toBe("page-item");
    const pagePreviousLink = fixture.nativeElement.querySelector('#pagePreviousLink');
    expect(pagePreviousLink.className).toBe("page-item disabled");
    const pageNextLink = fixture.nativeElement.querySelector('#pageNextLink');
    expect(pageNextLink.className).toBe("page-item");
    const pageLastLink = fixture.nativeElement.querySelector('#pageLastLink');
    expect(pageLastLink.className).toBe("page-item disabled");
    expect(component.booksPaginated._embedded.books).toHaveSize(2);
  });

  it('should create correct sort for title', () => {
    booksService.getBooks = (path: string, options?: any) =>  of ( { _embedded : { books : [{title:"a",author:"aa",_links:{self:{href:"/linka"}}},{title:"b",author:"ba",_links:{self:{href:"/linkb"}}}]}, _links : {}, page: { number: 0, totalPages: 1} } as HMPagination );
    fixture.detectChanges();
    expect(component.titleDirection).toBe("");
    component.sort('title');
    fixture.detectChanges();
    const colTitle = fixture.nativeElement.querySelector('#colTitle');
    expect(colTitle.className).toBe("sortable asc");
    component.sort('title');
    fixture.detectChanges();
    expect(colTitle.className).toBe("sortable desc");
    component.sort('title');
    fixture.detectChanges();
    expect(component.titleDirection).toBe("");
  });

  it('should create correct sort for author', () => {
    booksService.getBooks = (path: string, options?: any) =>  of ( { _embedded : { books : [{title:"a",author:"aa",_links:{self:{href:"/linka"}}},{title:"b",author:"ba",_links:{self:{href:"/linkb"}}}]}, _links : {}, page: { number: 0, totalPages: 1} } as HMPagination );
    fixture.detectChanges();
    expect(component.authorDirection).toBe("");
    component.sort('author');
    fixture.detectChanges();
    const colAuthor = fixture.nativeElement.querySelector('#colAuthor');
    expect(colAuthor.className).toBe("sortable asc");
    component.sort('author');
    fixture.detectChanges();
    expect(colAuthor.className).toBe("sortable desc");
    component.sort('author');
    fixture.detectChanges();
    expect(component.authorDirection).toBe("");
  });

  it('should invoke page size', () => {
    booksService.getBooks = (path: string, options?: any) =>  of ( { _embedded : { books : [{title:"a",author:"aa",_links:{self:{href:"/linka"}}},{title:"b",author:"ba",_links:{self:{href:"/linkb"}}}]}, _links : {}, page: { number: 0, totalPages: 1} } as HMPagination );
    component.titleDirection = "asc";
    fixture.detectChanges();
    const pageSizeSelect = fixture.nativeElement.querySelector('#pageSize');
    expect(pageSizeSelect.value).toBe("5");
    component.pageSize.setValue("10");
    component.changePageSize();
    fixture.detectChanges();
    expect(component.titleDirection).toBe(""); //this should reset
    expect(pageSizeSelect.value).toBe("10");
  });

  it('should open add book modal', () => {
    const compInst = { urlPath:"", book:{} as Book, action: ""};
    modalService.open = (content: any) => ( { componentInstance : compInst, result: new Promise<any>(() => ("closed"))} as NgbModalRef );
    fixture.detectChanges();
    component.addBook(); //should not throw exception
    fixture.detectChanges();
    expect(compInst.action).toEqual("NEW");
    expect(compInst.book.title).toEqual("");
    expect(compInst.book.author).toEqual("");
    expect(compInst.urlPath).toEqual("/books"); //default
  });

  it('should open update book modal', () => {
    const compInst = { urlPath:"", book:{} as Book, action: ""};
    modalService.open = (content: any) => ( { componentInstance : compInst, result: new Promise<any>(() => ("closed"))} as NgbModalRef );
    fixture.detectChanges();
    component.updateBook({title:"me",author:"you", _links: {self: {href: "/bookMeyou"}}} as Book); //should not throw exception
    fixture.detectChanges();
    expect(compInst.action).toEqual("UPDATE");
    expect(compInst.book.title).toEqual("me");
    expect(compInst.book.author).toEqual("you");
    expect(compInst.urlPath).toEqual("/bookMeyou");
  });

  it('should open delete book modal', () => {
    const compInst = { urlPath:"", book:{} as Book, action: ""};
    modalService.open = (content: any) => ( { componentInstance : compInst, result: new Promise<any>(() => ("closed"))} as NgbModalRef );
    fixture.detectChanges();
    component.deleteBook({title:"delete",author:"you", _links: {self: {href: "/deleteMe"}}} as Book); //should not throw exception
    fixture.detectChanges();
    expect(compInst.action).toEqual("DELETE");
    expect(compInst.book.title).toEqual("delete");
    expect(compInst.book.author).toEqual("you");
    expect(compInst.urlPath).toEqual("/deleteMe");
  });

});
