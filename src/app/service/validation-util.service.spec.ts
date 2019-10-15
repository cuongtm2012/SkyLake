import { TestBed, inject } from '@angular/core/testing';

import { ValidationUtilService } from './validation-util.service';

describe('ValidationUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationUtilService]
    });
  });

  it('should be created', inject([ValidationUtilService], (service: ValidationUtilService) => {
    expect(service).toBeTruthy();
  }));
});
