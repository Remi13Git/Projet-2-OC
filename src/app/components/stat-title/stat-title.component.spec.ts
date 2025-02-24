import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatTitleComponent } from './stat-title.component';

describe('StatTitleComponent', () => {
  let component: StatTitleComponent;
  let fixture: ComponentFixture<StatTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
