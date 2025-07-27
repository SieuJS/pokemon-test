import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      @apply block size-full container mx-auto px-4;
    }
  `,
})
export class App {
  protected title = 'front-end';
}
