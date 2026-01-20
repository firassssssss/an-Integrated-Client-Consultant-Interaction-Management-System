import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTComponent } from './view-t.component';

describe('ViewTComponent', () => {
  let component: ViewTComponent;
  let fixture: ComponentFixture<ViewTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
