import { TestBed } from '@angular/core/testing';

import { DataIosService } from './data-ios.service';

describe('DataIosService', () => {
  let service: DataIosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataIosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
