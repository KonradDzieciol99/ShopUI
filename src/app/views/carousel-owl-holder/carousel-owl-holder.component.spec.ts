import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselOwlHolderComponent } from './carousel-owl-holder.component';

describe('CarouselOwlHolderComponent', () => {
  let component: CarouselOwlHolderComponent;
  let fixture: ComponentFixture<CarouselOwlHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselOwlHolderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselOwlHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
