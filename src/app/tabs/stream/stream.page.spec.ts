import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamPage } from './stream.page';

describe('StreamPage', () => {
  let component: StreamPage;
  let fixture: ComponentFixture<StreamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
