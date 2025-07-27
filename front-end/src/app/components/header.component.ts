import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TwMergePipe } from '../pipes/tw-merge.pipe';

@Component({
  selector: 'app-header',
  imports: [TwMergePipe],
  template: `
    <header class="bg-blue-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <a href="index.html" class="text-2xl font-bold">Pokedex</a>
        <nav class="hidden md:flex space-x-6">
          <a href="index.html" class="hover:text-blue-200">Home</a>
          <a href="pokemon-list.html" class="hover:text-blue-200"
            >Pokémon List</a
          >
          <a href="#" class="hover:text-blue-200">Favorites</a>
        </nav>
        <button class="md:hidden" aria-label="Open menu" (click)="toggleMenu()">
          <span class="block w-6 h-1 bg-white mb-1 rounded"></span>
          <span class="block w-6 h-1 bg-white mb-1 rounded"></span>
          <span class="block w-6 h-1 bg-white rounded"></span>
        </button>
      </div>

      <div [class]=" ['bg-blue-700', !openMenu() && 'hidden'] | twMerge ">
        <div class="px-4 py-2 space-y-1">
          <a
            href="index.html"
            class="block py-3 px-2 hover:text-blue-200 hover:bg-blue-600 rounded transition-colors"
            >Home</a
          >
          <a
            href="pokemon-list.html"
            class="block py-3 px-2 hover:text-blue-200 hover:bg-blue-600 rounded transition-colors"
            >Pokémon List</a
          >
          <a
            href="#"
            class="block py-3 px-2 hover:text-blue-200 hover:bg-blue-600 rounded transition-colors"
            >Favorites</a
          >
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
}
