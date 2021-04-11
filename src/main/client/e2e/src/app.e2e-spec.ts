import { browser, logging } from 'protractor';
import { LibraryAppPage } from './app.po';

const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router(require('path').join(__dirname, './mockdb.json'))
const middlewares = jsonServer.defaults()

describe('workspace-project App', () => {
  let page: LibraryAppPage;

  beforeAll(() => {
    server.use(middlewares)
    server.use(jsonServer.rewriter({
      "/api/": "/rootMock",
      "/api/*": "/$1",
      "/books": "/paginatedMock",
      "/books\\?size=:size": "/paginatedMock"
    }))
    server.use(router)
    server.listen(3000, () => {
      console.log('Mock JSON Server is running')
    })
    });

  beforeEach(() => {
    page = new LibraryAppPage();
  });

  it('should display App name', async () => {
    await page.navigateTo();
    expect(await page.getAppName()).toEqual('Library');
  });

  it('should display Books', async () => {
    await page.navigateTo();
    const bookTitles =  await page.getBookTitles();
    expect(await bookTitles[0].getText()).toBe("End of Watch");
    expect(await bookTitles.length).toEqual(5);
  });

  it('should display Update Buttons', async () => {
    await page.navigateTo();
    const updateBtns = await page.getUpdateBtns();
    expect(await updateBtns[0].isPresent()).toBeTruthy();
    expect(await updateBtns[0].getText()).toBe("Update");
  });

  it('should display Delete Buttons', async () => {
    await page.navigateTo();
    const deleteBtns = await page.getDeleteBtns();
    expect(await deleteBtns[0].isPresent()).toBeTruthy();
    expect(await deleteBtns[0].getText()).toBe("Delete");
  });

  it('should display Add Book Button and Click and Then Cancel', async () => {
    await page.navigateTo();
    const addBook = await page.getAddBookBtn();
    expect(addBook.isPresent()).toBeTruthy();
    expect(addBook.getText()).toContain("Add Book");
    //Open for Control
    await addBook.click();
    const bookTitleInpt = await page.getBookTitleInpt();
    expect(bookTitleInpt.getAttribute('value')).toBe("");
    const bookAuthorInpt = await page.getBookAuthorInpt();
    expect(bookAuthorInpt.getAttribute('value')).toBe("");
    const cancelBtn = await page.getCancelBtn();
    expect(cancelBtn.isPresent()).toBeTruthy();
    //Close & check
    await cancelBtn.click();
    expect(cancelBtn.isPresent()).not.toBeTruthy();
  });

  it('should click on Update and Then Cancel', async () => {
    await page.navigateTo();
    const updateBtns = await page.getUpdateBtns();
    const firstUpdateBtn = await updateBtns[0];
    //Open for Update
    await firstUpdateBtn.click();
    const bookTitleInpt = await page.getBookTitleInpt();
    expect(bookTitleInpt.getAttribute('value')).toBe("End of Watch");
    const bookAuthorInpt = await page.getBookAuthorInpt();
    expect(bookAuthorInpt.getAttribute('value')).toBe("Stephen King");
    const updateSubmitBtn = await page.getSubmitBtn();
    expect(updateSubmitBtn.getText()).toBe("Update");
    const cancelBtn = await page.getCancelBtn();
    expect(cancelBtn.isPresent()).toBeTruthy();
    //Close & check
    await cancelBtn.click();
    expect(cancelBtn.isPresent()).not.toBeTruthy();
  });

  it('should click on Delete and Then Cancel', async () => {
    await page.navigateTo();
    const deleteBtns = await page.getDeleteBtns();
    const firstDeleteBtn = await deleteBtns[0];
    //Open for Update
    await firstDeleteBtn.click();
    const bookTitleInpt = await page.getBookTitleInpt();
    expect(bookTitleInpt.getAttribute('value')).toBe("End of Watch");
    const bookAuthorInpt = await page.getBookAuthorInpt();
    expect(bookAuthorInpt.getAttribute('value')).toBe("Stephen King");
    const deleteSubmitBtn = await page.getSubmitBtn();
    expect(deleteSubmitBtn.getText()).toBe("Delete");
    const cancelBtn = await page.getCancelBtn();
    expect(cancelBtn.isPresent()).toBeTruthy();
    //Close & check
    await cancelBtn.click();
    expect(cancelBtn.isPresent()).not.toBeTruthy();
  });

  /* This works, however data manipulation removes _links from db and making tests unrepeatable. e2e without actual backend is not feasable.
  it('should Update Record', async () => {
    await page.navigateTo();
    const updateBtns = await page.getUpdateBtns();
    const firstUpdateBtn = await updateBtns[0];
    //Open for Update
    await firstUpdateBtn.click();
    const bookTitleInpt = await page.getBookTitleInpt();
    expect(bookTitleInpt.getAttribute('value')).toBe("End of Watch");
    const bookAuthorInpt = await page.getBookAuthorInpt();
    expect(bookAuthorInpt.getAttribute('value')).toBe("Stephen King");
    await bookAuthorInpt.clear();
    await bookAuthorInpt.sendKeys('Updated King');
    const updateSubmitBtn = await page.getSubmitBtn();
    expect(updateSubmitBtn.getText()).toBe("Update");
    await updateSubmitBtn.click();
    //Table will be refreshed
    const bookAuthors = await page.getBookAuthors();
    const firstBookAuthor = await bookAuthors[0];
    expect(firstBookAuthor.getText()).toBe("Updated King");
  });
 */

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });

});
