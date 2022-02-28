import { TestBed } from '@angular/core/testing';

import { AxiosClientService } from './axios-client.service';

describe('AxiosClientService', () => {
  let service: AxiosClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AxiosClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
