import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, map, merge } from 'rxjs';

import { TwMergePipe } from '../pipes/tw-merge.pipe';

@Directive({
  selector: '[appImageFallback], img[fallback]',
  providers: [TwMergePipe],
  host: {
    '[class]': 'hostClass()',
  },
})
export class ImageFallbackDirective {
  private readonly el = inject<ElementRef<HTMLImageElement>>(ElementRef);
  private readonly twMerge = inject(TwMergePipe);
  readonly loadingClass = input<string>('');
  readonly fallback = input.required<string>();
  readonly status = toSignal(
    merge(
      fromEvent(this.el.nativeElement, 'error').pipe(map(() => 'error')),
      fromEvent(this.el.nativeElement, 'load').pipe(map(() => 'loaded')),
    ),
    {
      initialValue: 'loading',
    },
  );

  readonly hostClass = computed(() => {
    return this.status() === 'loading'
      ? this.twMerge.transform('animate-pulse bg-zinc-200', this.loadingClass())
      : '';
  });

  constructor() {
    effect(() => {
      if (this.status() === 'error') {
        this.el.nativeElement.src = this.fallback();
      }
    });
  }
}
