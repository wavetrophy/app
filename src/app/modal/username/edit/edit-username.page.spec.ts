import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUsernamePage } from './edit-username.page';

describe('UsernamePage', () => {
  let component: EditUsernamePage;
  let fixture: ComponentFixture<EditUsernamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUsernamePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUsernamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
