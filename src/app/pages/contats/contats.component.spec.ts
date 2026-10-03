import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContatsComponent } from './contats.component';

describe('ContatsComponent', () => {
  let component: ContatsComponent;
  let fixture: ComponentFixture<ContatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
