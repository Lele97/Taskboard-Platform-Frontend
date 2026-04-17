import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardAnalitycs } from './board-analitycs';

describe('BoardAnalitycs', () => {
  let component: BoardAnalitycs;
  let fixture: ComponentFixture<BoardAnalitycs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardAnalitycs],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardAnalitycs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
