import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolOneComponent } from './tool-one.component';

describe('ToolOneComponent', () => {
  let component: ToolOneComponent;
  let fixture: ComponentFixture<ToolOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
