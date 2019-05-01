import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionPage } from './create-question.page';

describe('CreateQuestionPage', () => {
  let component: CreateQuestionPage;
  let fixture: ComponentFixture<CreateQuestionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuestionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
