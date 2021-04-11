import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { CaptchaRequest } from '../models/CaptchaRequest';

import { CaptchaService } from './captcha.service';

describe('CaptchaService', () => {
  let service: CaptchaService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(CaptchaService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return HttpError with Missing Captcha Input', () => {
    const emsg = { errors: [{message: "Invalid Captcha"}]};

    const captchaRequest = {} as CaptchaRequest;
    service.validateCaptcha(captchaRequest).subscribe((data:any) => {
      expect(data.errors[0].message).toEqual("Invalid Captcha");
      expect(data.status_code).toEqual(400);
      expect(data.error_message).toEqual("Server returned error code 400. Please refresh the page and try again.");
    });

    const req = httpTestingController.expectOne("/api/validateCaptcha");
    expect(req.request.method).toEqual('POST');
    req.flush(emsg, { status: 400, statusText: 'Bad Request' });
  });

  it('should return HttpError with Connection Timeout Message', () => {
    const mockError = new ErrorEvent('Network error', {
      message: "Connection Timeout",
    });

    const captchaRequest = {} as CaptchaRequest;
    service.validateCaptcha(captchaRequest).subscribe((data:any) => {
      expect(data.errors).toBeUndefined();
      expect(data.status_code).toBeUndefined();
      expect(data.error_message).toEqual("An error occurred: Connection Timeout. Please refresh the page and try again.");
    });

    const req = httpTestingController.expectOne("/api/validateCaptcha");
    expect(req.request.method).toEqual('POST');

    req.error(mockError);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

});
