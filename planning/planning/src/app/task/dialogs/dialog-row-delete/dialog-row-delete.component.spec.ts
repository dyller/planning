import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRowDeleteComponent } from './dialog-row-delete.component';

describe('DialogRowDeleteComponent', () => {
  let component: DialogRowDeleteComponent;
  let fixture: ComponentFixture<DialogRowDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogRowDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRowDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
