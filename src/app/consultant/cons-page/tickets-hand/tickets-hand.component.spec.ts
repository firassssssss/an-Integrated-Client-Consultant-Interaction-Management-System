import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsHandComponent } from './tickets-hand.component';

describe('TicketsHandComponent', () => {
  let component: TicketsHandComponent;
  let fixture: ComponentFixture<TicketsHandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsHandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketsHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
