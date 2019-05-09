import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseTeamPage } from './choose-team.page';

describe('ChooseTeamPage', () => {
  let component: ChooseTeamPage;
  let fixture: ComponentFixture<ChooseTeamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseTeamPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseTeamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
