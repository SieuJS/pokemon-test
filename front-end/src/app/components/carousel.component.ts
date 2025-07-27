import { ChangeDetectionStrategy, Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselItemDirective } from '../directives/carousel-item.directive';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule],
  standalone: true,
  template: `
    <div class="carousel-container">
      <button (click)="prev()">Prev</button>
      <ng-content></ng-content>
      <button (click)="next()">Next</button>
    </div>
  `,
  styles: `
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carousel implements AfterContentInit {
  @ContentChildren(CarouselItemDirective, { descendants: true, read: CarouselItemDirective })
  items!: QueryList<CarouselItemDirective>;
  currentIndex = 0;

  ngAfterContentInit() {
    this.updateItems();
    this.items.changes.subscribe(() => this.updateItems());
  }

  next() {
    if (!this.items) return;
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateItems();
  }

  prev() {
    if (!this.items) return;
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.updateItems();
  }

  private updateItems() {
    if (!this.items) return;
    this.items.forEach((item, idx) => {
      const el = item.elementRef.nativeElement;
      el.hidden = idx !== this.currentIndex;
    });
  }
}
