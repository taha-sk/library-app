import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BooksService } from '../services/books.service';
import { IpService } from '../services/ip.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Book } from '../models/Book';
import { HttpError } from '../models/HttpError';
import { CaptchaService } from '../services/captcha.service';
import { CaptchaRequest } from '../models/CaptchaRequest';
import { CaptchaResponse } from '../models/CaptchaResponse';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() urlPath: string;
  @Input() book: Book;
  @Input() action: string;

  ip: string;

  errorResponse: HttpError;

  showLoadingAnimation: boolean = false;

  bookForm = this.formBuilder.group({
    title: ['', Validators.required],
    author: ['', Validators.required]
  });

  //Getters are necessary for form validation
  get title() { return this.bookForm.get('title'); }
  get author() { return this.bookForm.get('author'); }

  // For NEW Action
  get captcha() { return this.bookForm.get('captcha'); }

  constructor(
    public activeModal: NgbActiveModal,
    private booksService: BooksService,
    private ipService: IpService,
    private captchaService: CaptchaService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {
    this.ipService.getIp().subscribe( (data:any) =>
    {
      if(data?.error_message !== undefined)
      {
        this.ip = "";
      }else{
        this.ip = (data as {ip:string}).ip;
      }
    }
    );
    this.bookForm.patchValue({ title: this.book.title, author: this.book.author });
    if( this.action === "NEW"){
      this.bookForm.addControl('captcha', new FormControl('', Validators.required));
      //Due to a bug in ng-recaptcha
      this.captcha.reset();
    }
    if( this.action === "DELETE"){
      this.title.disable();
      this.author.disable();
    }
  }

  save(){
    this.activeModal.close('Save click');
  }

  onSubmit(){
    this.showLoadingAnimation = true;
    if( this.action === "NEW"){
      const captchaRequest = { response: this.captcha.value, remoteip: this.ip} as CaptchaRequest
      this.captchaService.validateCaptcha(captchaRequest).subscribe(
        (data:any) =>
        {
          if(data?.error_message !== undefined)
          {
            this.showLoadingAnimation = false;
            this.errorResponse = data as HttpError;
            this.captcha.reset();
          }else{
            const captchaResponse = data as CaptchaResponse;
            if(captchaResponse.success){
              const newBook = this.bookForm.value as Book
              this.booksService.createBook(this.urlPath, newBook).subscribe( (data:any) =>
                {
                  this.showLoadingAnimation = false;
                  if(data?.error_message !== undefined)
                  {
                    this.errorResponse = data as HttpError;
                    this.captcha.reset();
                  }else{
                    this.save();
                  }
                }
              );
            }else{
              this.showLoadingAnimation = false;
              this.errorResponse = { error_message: "Invalid Captcha. Please try again." } as HttpError;
              this.captcha.reset();
            }
          }
        }
      );
    }else if (this.action === "UPDATE"){
      const updatedBook = this.bookForm.value as Book
      this.booksService.updateBook(this.urlPath, updatedBook).subscribe( (data:any) =>
      {
        this.showLoadingAnimation = false;
        if(data?.error_message !== undefined)
        {
          this.errorResponse = data as HttpError;
        }else{
          this.save();
        }
      }
    );
    }else if (this.action === "DELETE"){
      this.booksService.deleteBook(this.urlPath).subscribe( (data:any) =>
      {
        this.showLoadingAnimation = false;
        if(data?.error_message !== undefined)
        {
          this.errorResponse = data as HttpError;
        }else{
          this.save();
        }
      }
    );
    }

  }

}
