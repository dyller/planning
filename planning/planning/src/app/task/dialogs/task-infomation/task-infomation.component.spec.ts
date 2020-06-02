import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskInfomationComponent } from './task-infomation.component';

describe('TaskInfomationComponent', () => {
  let component: TaskInfomationComponent;
  let fixture: ComponentFixture<TaskInfomationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskInfomationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskInfomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
