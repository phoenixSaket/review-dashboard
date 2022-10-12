import { TestBed } from '@angular/core/testing';

import { DataAndroidService } from './data-android.service';

describe('DataAndroidService', () => {
  let service: DataAndroidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataAndroidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
