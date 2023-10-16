import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { of } from 'rxjs';
import { Book } from '../models/Book';
import { CaptchaRequest } from '../models/CaptchaRequest';
import { CaptchaResponse } from '../models/CaptchaResponse';
import { HMPagination } from '../models/HMPagination';
import { HMRoot } from '../models/HMRoot';
import { HttpError } from '../models/HttpError';
import { BooksService } from '../services/books.service';
import { CaptchaService } from '../services/captcha.service';
import { IpService } from '../services/ip.service';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  //Services
  let booksService: BooksService;
  let activeModal: NgbActiveModal;
  let ipService: IpService;
  let captchaService: CaptchaService;
  let formBuilder: FormBuilder;

  //Stubs for test (Mocks)
  let booksServiceStub: Partial<BooksService>;
  let ipServiceStub: Partial<IpService>;
  let captchaServiceStub: Partial<CaptchaService>;

  beforeEach(async () => {
    booksServiceStub = {
      getRoot(path: string){
        const result = { _links : { books: { href : "/books"}}} as HMRoot;
        return of (result);
      },
      getBooks(path: string, options?: any){
        const result = { _embedded : { books : []} } as unknown as HMPagination;
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
    ipServiceStub = {
      getIp(){
        return of( {ip: "127.0.0.2"} );
      }
    };
    captchaServiceStub = {
      validateCaptcha(req: CaptchaRequest){
        return of({success: true} as CaptchaResponse);
      }
    };
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RecaptchaModule, RecaptchaFormsModule],
      declarations: [ ModalComponent ],
      providers: [ { provide: CaptchaService, useValue: captchaServiceStub }, 
        { provide: IpService, useValue: ipServiceStub }, 
        { provide: BooksService, useValue: booksServiceStub }, 
        NgbActiveModal, FormBuilder ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    booksService = TestBed.inject(BooksService);
    ipService = TestBed.inject(IpService);
    captchaService = TestBed.inject(CaptchaService);
    activeModal = TestBed.inject(NgbActiveModal);
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Initial State Tests

  it('should initialize for NEW', () => {
    component.urlPath = "/books";
    component.book = { title: "", author: ""} as Book;
    component.action = "NEW";
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('h5');
    expect(title.textContent).toBe("Add New Book");
    expect(component.ip).toEqual("127.0.0.2");
    expect(component.title!.value).toEqual("");
    expect(component.author!.value).toEqual("");
    expect(component.title!.enabled).toEqual(true);
    expect(component.author!.enabled).toEqual(true);
    expect(component.captcha).toBeDefined();
    const error = fixture.nativeElement.querySelector('.alert-danger');
    expect(error).toBeNull(); //No errors should be shown
    const submit = fixture.nativeElement.querySelector('[type=submit]');
    expect(submit.textContent).toBe("Add");
    expect(component.errorResponse).toBeUndefined();
  });

  it('should initialize for UPDATE', () => {
    component.urlPath = "/books/1";
    component.book = { title: "atit", author: "aauth"} as Book;
    component.action = "UPDATE";
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('h5');
    expect(title.textContent).toBe("Update Book");
    expect(component.ip).toEqual("127.0.0.2");
    expect(component.title!.value).toEqual("atit");
    expect(component.author!.value).toEqual("aauth");
    expect(component.title!.enabled).toEqual(true);
    expect(component.author!.enabled).toEqual(true);
    expect(component.captcha).toBeNull();
    const error = fixture.nativeElement.querySelector('.alert-danger');
    expect(error).toBeNull(); //No errors should be shown
    const submit = fixture.nativeElement.querySelector('[type=submit]');
    expect(submit.textContent).toBe("Update");
    expect(component.errorResponse).toBeUndefined();
  });

  it('should initialize for DELETE', () => {
    component.urlPath = "/books/2";
    component.book = { title: "atitd", author: "aauthd"} as Book;
    component.action = "DELETE";
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('h5');
    expect(title.textContent).toBe("Delete Book");
    expect(component.ip).toEqual("127.0.0.2");
    expect(component.title!.value).toEqual("atitd");
    expect(component.author!.value).toEqual("aauthd");
    expect(component.title!.enabled).toEqual(false);
    expect(component.author!.enabled).toEqual(false);
    expect(component.captcha).toBeNull();
    const error = fixture.nativeElement.querySelector('.alert-danger');
    expect(error).toBeNull(); //No errors should be shown
    const deleteMsg = fixture.nativeElement.querySelector('p > b');
    expect(deleteMsg.textContent).toContain("Are you sure you want to delete this record?");
    const submit = fixture.nativeElement.querySelector('[type=submit]');
    expect(submit.textContent).toBe("Delete");
    expect(component.errorResponse).toBeUndefined();
  });

  //Form Validations

  it('should have invalid form with missing title field for UPDATE', () => {
    component.urlPath = "/books/1";
    component.book = { title: "atit", author: "aauth"} as Book;
    component.action = "UPDATE";
    fixture.detectChanges();

    const bookTitleInput = fixture.nativeElement.querySelector('#bookTitle');
    const event = new Event('input');
  
    bookTitleInput.value = '';
    bookTitleInput.dispatchEvent(event);

    expect(component.title!.value).toEqual('');
    expect(component.author!.value).toEqual('aauth');
    expect(component.bookForm.status).toEqual('INVALID');
  });

  it('should have invalid form with missing author field for UPDATE', () => {
    component.urlPath = "/books/1";
    component.book = { title: "atit", author: "aauth"} as Book;
    component.action = "UPDATE";
    fixture.detectChanges();

    const bookAuthorInput = fixture.nativeElement.querySelector('#bookAuthor');
    const event = new Event('input');
  
    bookAuthorInput.value = '';
    bookAuthorInput.dispatchEvent(event);
  
    expect(component.title!.value).toEqual('atit');
    expect(component.author!.value).toEqual('');
    expect(component.bookForm.status).toEqual('INVALID');
  });

  it('should have valid form for UPDATE', () => {
    component.urlPath = "/books/1";
    component.book = { title: "atit", author: "aauth"} as Book;
    component.action = "UPDATE";
    fixture.detectChanges();  
    expect(component.title!.value).toEqual('atit');
    expect(component.author!.value).toEqual('aauth');
    expect(component.bookForm.status).toEqual('VALID');
  });

  //Submit Tests

  //Update

  it('should have valid submit for UPDATE', () => {
    component.urlPath = "/books/1";
    component.book = { title: "atit", author: "aauth"} as Book;
    component.action = "UPDATE";
    fixture.detectChanges();
    component.onSubmit();  
    fixture.detectChanges();
    //Valid Flow
    expect(component.showLoadingAnimation).toEqual(false);
    expect(component.errorResponse).toBeUndefined();
  });

  it('should have server error for invalid submit of UPDATE', () => {
    booksService.updateBook = (path: string, book: Book) => of ( { error_message:"Another Nasty Error", status_code:400} as HttpError);
    component.urlPath = "/books/1";
    component.book = { title: "atit", author: "aauth"} as Book;
    component.action = "UPDATE";
    fixture.detectChanges();
    component.onSubmit();  
    fixture.detectChanges();
    //Error Flow
    expect(component.showLoadingAnimation).toEqual(false);
    expect(component.errorResponse).toBeDefined();
    const error = fixture.nativeElement.querySelector('.alert-danger');
    expect(error.textContent).toContain("Another Nasty Error"); //Errors should be shown
  });

  it('should have server validation error for invalid submit of UPDATE', () => {
    booksService.updateBook = (path: string, book: Book) => of ( { error_message:"Internal Server Error", status_code:500, errors:[{entity:"Book", property:"title", message:"Title is required"}]} as HttpError);
    component.urlPath = "/books/1";
    component.book = { title: "", author: "aauth"} as Book;
    component.action = "UPDATE";
    fixture.detectChanges();
    component.onSubmit();  
    fixture.detectChanges();
    //Error Flow
    expect(component.showLoadingAnimation).toEqual(false);
    expect(component.errorResponse).toBeDefined();
    const error = fixture.nativeElement.querySelector('.alert-danger');
    expect(error.textContent).toContain("Title is required"); //Errors should be shown
  });

  //Delete

  it('should have valid submit for DELETE', () => {
    component.urlPath = "/books/2";
    component.book = { title: "atitd", author: "aauthd"} as Book;
    component.action = "DELETE";
    fixture.detectChanges();
    component.onSubmit();  
    fixture.detectChanges();
    //Valid Flow
    expect(component.showLoadingAnimation).toEqual(false);
    expect(component.errorResponse).toBeUndefined();
  });

  it('should have server error for invalid submit of DELETE', () => {
    booksService.deleteBook = (path: string) => of ( { error_message:"Less Nasty Error", status_code:404} as HttpError);
    component.urlPath = "/books/2";
    component.book = { title: "", author: "aauthd"} as Book;
    component.action = "DELETE";
    fixture.detectChanges();
    component.onSubmit();  
    fixture.detectChanges();
    //Error Flow
    expect(component.showLoadingAnimation).toEqual(false);
    expect(component.errorResponse).toBeDefined();
    const error = fixture.nativeElement.querySelector('.alert-danger');
    expect(error.textContent).toContain("Less Nasty Error"); //Errors should be shown
  });

  //New

  it('should have valid submit for NEW with valid Captcha', () => {
    component.urlPath = "/books";
    component.book = { title: "newTitle", author: "newAuthor"} as Book;
    component.action = "NEW";
    fixture.detectChanges();
    component.onSubmit();  
    fixture.detectChanges();
    //Valid Flow
    expect(component.showLoadingAnimation).toEqual(false);
    expect(component.errorResponse).toBeUndefined();
  });

  it('should have invalid submit for NEW with false Captcha', () => {
    captchaService.validateCaptcha = (req: CaptchaRequest) => of({success: false} as CaptchaResponse);
    component.urlPath = "/books";
    component.book = { title: "newTitle", author: "newAuthor"} as Book;
    component.action = "NEW";
    fixture.detectChanges();
    component.onSubmit();  
    fixture.detectChanges();
    //Valid Flow
    expect(component.showLoadingAnimation).toEqual(false);
    expect(component.errorResponse.error_message).toBe("Invalid Captcha. Please try again.");
  });

  it('should have invalid submit for NEW with Captcha Server Error', () => {
    captchaService.validateCaptcha = (req: CaptchaRequest) => of( { error_message:"Just An Error", status_code:404} as HttpError);
    component.urlPath = "/books";
    component.book = { title: "newTitle", author: "newAuthor"} as Book;
    component.action = "NEW";
    fixture.detectChanges();
    component.onSubmit();  
    fixture.detectChanges();
    //Error Flow
    expect(component.showLoadingAnimation).toEqual(false);
    expect(component.errorResponse).toBeDefined();
    const error = fixture.nativeElement.querySelector('.alert-danger');
    expect(error.textContent).toContain("Just An Error"); //Errors should be shown
  });

  it('should have server error for invalid submit of NEW', () => {
    booksService.createBook = (path: string, book: Book) => of ( { error_message:"Internal Server Error", status_code:500, errors:[{entity:"Book", property:"author", message:"Author is required"}]} as HttpError);
    component.urlPath = "/books";
    component.book = { title: "newTitle", author: ""} as Book;
    component.action = "NEW";
    fixture.detectChanges();
    component.onSubmit();  
    fixture.detectChanges();
    //Error Flow
    expect(component.showLoadingAnimation).toEqual(false);
    expect(component.errorResponse).toBeDefined();
    const error = fixture.nativeElement.querySelector('.alert-danger');
    expect(error.textContent).toContain("Author is required"); //Errors should be shown
  });

  it('should have an empty IP for the error encountered in IPService', () => {
    ipService.getIp = () => of ( { error_message:"This is the last one", status_code:404} as HttpError);
    component.urlPath = "/books";
    component.book = { title: "", author: ""} as Book;
    component.action = "NEW";
    fixture.detectChanges();
    expect(component.ip).toBeDefined();
    expect(component.ip).toEqual("");
  });

});
