import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePhonenumberPage } from './create-phonenumber.page';

describe('CreatePhonenumberPage', () => {
  let component: CreatePhonenumberPage;
  let fixture: ComponentFixture<CreatePhonenumberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePhonenumberPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePhonenumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
