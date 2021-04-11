import { browser, by, element, ElementFinder } from 'protractor';

export class LibraryAppPage {
  async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl);
  }

  async getAppName(): Promise<string> {
    return element(by.css('.navbar-brand')).getText();
  }

  async getBookTitles(): Promise<ElementFinder[]> {
    return element.all(by.css('#rowBookTitle'));
  }

  async getBookAuthors(): Promise<ElementFinder[]> {
    return element.all(by.css('#rowBookAuthor'));
  }

  async getAddBookBtn(): Promise<ElementFinder> {
    return element(by.css('#addBookBtn'));
  }

  async getBookTitleInpt(): Promise<ElementFinder> {
    return element(by.css('#bookTitle'));
  }

  async getBookAuthorInpt(): Promise<ElementFinder> {
    return element(by.css('#bookAuthor'));
  }

  async getCancelBtn(): Promise<ElementFinder> {
    return element(by.css('#cancelBtn'));
  }

  async getUpdateBtns(): Promise<ElementFinder[]> {
    return element.all(by.css('#updateBookBtn'));
  }
  
  async getDeleteBtns(): Promise<ElementFinder[]> {
    return element.all(by.css('#deleteBookBtn'));
  }

  async getSubmitBtn(): Promise<ElementFinder> {
    return element(by.css('[type=submit]'));
  }

}
