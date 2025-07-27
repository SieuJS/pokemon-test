import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TwMergePipe } from '../pipes/tw-merge.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [TwMergePipe, RouterLink],
  template: `
    <header class="bg-blue-600 text-white p-4">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <a href="index.html" class="text-2xl font-bold">Pokedex</a>
        <nav class="hidden md:flex space-x-6">
          @for (item of urls; track $index) {
          <a
            [routerLink]="item.url"
            class="hover:text-blue-200 transition-colors"
            >{{ item.name }}</a
          >
          }
        </nav>
        <button class="md:hidden" aria-label="Open menu" (click)="toggleMenu()">
          <span class="block w-6 h-1 bg-white mb-1 rounded"></span>
          <span class="block w-6 h-1 bg-white mb-1 rounded"></span>
          <span class="block w-6 h-1 bg-white rounded"></span>
        </button>
      </div>

      <div [class]=" ['bg-blue-700', !openMenu() && 'hidden'] | twMerge ">
        <div class="px-4 py-2 space-y-1">
          @for (item of urls; track $index) {
          <a
            [routerLink]="item.url"
            class="block py-3 px-2 hover:text-blue-200 hover:bg-blue-600 rounded transition-colors"
            >{{ item.name }}</a
          >
          }
        </div>
      </div>
    </header>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  openMenu = signal(false);
  toggleMenu() {
    this.openMenu.set(!this.openMenu())
  }

  readonly urls = [
    { name: 'Home', url: '' },
    { name: 'Pokémon List', url: 'pokemon-list' },
  ]
}
