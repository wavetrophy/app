import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerOptionsPage } from './answer-options.page';

describe('AnswerOptionsPage', () => {
  let component: AnswerOptionsPage;
  let fixture: ComponentFixture<AnswerOptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerOptionsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
