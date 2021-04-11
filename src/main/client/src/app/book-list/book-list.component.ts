import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';
import { Book } from '../models/Book';
import { HMPagination } from '../models/HMPagination';
import { HMRoot } from '../models/HMRoot';
import { HttpError } from '../models/HttpError';
import { BooksService } from '../services/books.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  booksPath: string;

  booksPaginated: HMPagination;

  errorResponse: HttpError;

  titleDirection = "";
  authorDirection = "";

  pageSize = new FormControl('5', Validators.required);

  constructor(
    private modalService: NgbModal,
    private booksService: BooksService
  ) { }

  ngOnInit(): void {
    this.booksService.getRoot("/api").subscribe( (data:any) =>
    {
      if(data?.error_message !== undefined)
      {
        this.errorResponse = data as HttpError;
      }else{
        const root = data as HMRoot;
        if(root._links.books.href.indexOf("{") > 0){
          const paramStartIndex = root._links.books.href.indexOf("{");
          this.booksPath = root._links.books.href.substring(0, paramStartIndex)
        }else{
          this.booksPath = root._links.books.href  
        }
        this.getBooksWithParams(this.booksPath, {params: {"size": this.pageSize.value} as const});
      }
    });
  }

  getBooks(path: string){
    this.getBooksWithParams(path);
  }

  getBooksWithParams(path: string, params?: any){
    this.booksService.getBooks(path, params).subscribe( (data:any) =>
    {
      if(data?.error_message !== undefined)
      {
        this.errorResponse = data as HttpError;
      }else{
        this.booksPaginated = data as HMPagination;
      }
    });
  }

  addBook(){
    this.openModal(this.booksPath, { title: "", author: "" } as Book, "NEW")
  }

  updateBook(book: Book){
    this.openModal(book._links.self.href, book, "UPDATE")
  }

  deleteBook(book: Book){
    this.openModal(book._links.self.href, book, "DELETE")
  }

  openModal(urlPath: string, book: Book, action: string) {
    const modalRef = this.modalService.open(ModalComponent)
    modalRef.componentInstance.urlPath = urlPath;
    modalRef.componentInstance.book = book;
    modalRef.componentInstance.action = action;
    modalRef.result.then((result) => {
      console.log(`Closed with: ${result}`);
      //After close, reset directions and getBooks again.
      this.changePageSize();
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  sort(component: string){
    if(component === "title"){
      //next direction
      this.titleDirection = this.nextDirection(this.titleDirection);
      //reset
      this.authorDirection = "";
      if(this.titleDirection.length > 0){
        this.getBooksWithParams(this.booksPath, {params: {"size": this.pageSize.value, "sort": "title,"+this.titleDirection} as const});
      }else{
        this.getBooksWithParams(this.booksPath, {params: {"size": this.pageSize.value} as const});
      }
    }else{
      //next direction
      this.authorDirection = this.nextDirection(this.authorDirection);
      //reset
      this.titleDirection = "";
      if(this.authorDirection.length > 0){
        this.getBooksWithParams(this.booksPath, {params: {"size": this.pageSize.value, "sort": "author,"+this.authorDirection} as const});
      }else{
        this.getBooksWithParams(this.booksPath, {params: {"size": this.pageSize.value} as const});
      }
    }
  }

  nextDirection(direction: string){
    if(direction === "asc"){
      return "desc";
    }else if(direction === "desc"){
      return "";
    }else{
      return "asc";
    }
  }

  changePageSize(){
    //reset directions
    this.titleDirection = "";
    this.authorDirection = "";
    this.getBooksWithParams(this.booksPath, {params: {"size": this.pageSize.value} as const});
  }

  //We can't use parseInt on the component, this is the solution
  convertInt(val: string){
    return parseInt(val, 10);
  }

}
