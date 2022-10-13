import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IosCardComponent } from './ios-card.component';

describe('IosCardComponent', () => {
  let component: IosCardComponent;
  let fixture: ComponentFixture<IosCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IosCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IosCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
