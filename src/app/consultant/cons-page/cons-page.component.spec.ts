import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsPageComponent } from './cons-page.component';

describe('ConsPageComponent', () => {
  let component: ConsPageComponent;
  let fixture: ComponentFixture<ConsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
