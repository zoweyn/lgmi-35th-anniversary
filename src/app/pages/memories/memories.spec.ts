import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Memories } from './memories';

describe('Memories', () => {
  let component: Memories;
  let fixture: ComponentFixture<Memories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Memories],
    }).compileComponents();

    fixture = TestBed.createComponent(Memories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
