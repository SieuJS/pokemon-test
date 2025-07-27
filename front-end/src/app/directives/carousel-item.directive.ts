
import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appCarouselItem]'
})
export class CarouselItemDirective {
  readonly elementRef = inject(ElementRef);
}
