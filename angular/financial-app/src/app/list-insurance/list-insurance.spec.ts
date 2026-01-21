import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInsurance } from './list-insurance';

describe('ListInsurance', () => {
  let component: ListInsurance;
  let fixture: ComponentFixture<ListInsurance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListInsurance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInsurance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
