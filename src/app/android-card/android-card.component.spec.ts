import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AndroidCardComponent } from './android-card.component';

describe('AndroidCardComponent', () => {
  let component: AndroidCardComponent;
  let fixture: ComponentFixture<AndroidCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AndroidCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AndroidCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
