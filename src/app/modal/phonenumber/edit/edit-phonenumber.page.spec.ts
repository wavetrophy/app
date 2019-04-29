import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhonenumberPage } from './edit-phonenumber.page';

describe('PhonenumberPage', () => {
  let component: EditPhonenumberPage;
  let fixture: ComponentFixture<EditPhonenumberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPhonenumberPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPhonenumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
