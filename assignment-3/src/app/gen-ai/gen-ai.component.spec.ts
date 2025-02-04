import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenAiComponent } from './gen-ai.component';

describe('GenAiComponent', () => {
  let component: GenAiComponent;
  let fixture: ComponentFixture<GenAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
