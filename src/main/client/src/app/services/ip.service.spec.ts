import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';

import { IpService } from './ip.service';

describe('IpService', () => {
  let service: IpService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(IpService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return IP information', () => {
    const testData = {ip: '127.0.0.1'};

    service.getIp().subscribe((data:any) => {
      expect(data.ip).toEqual("127.0.0.1");
    });

    const req = httpTestingController.expectOne("https://api.ipify.org/?format=json");
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

});
