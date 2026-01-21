import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteInsurance } from './delete-insurance';

describe('DeleteInsurance', () => {
  let component: DeleteInsurance;
  let fixture: ComponentFixture<DeleteInsurance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteInsurance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteInsurance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
