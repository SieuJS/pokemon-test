import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../api/services';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CarouselCardComponent } from '../components/carousel-card.component';
import { Header } from '../components/header.component';
import { ItemCardComponent } from '../components/item-card.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CarouselCardComponent, Header, ItemCardComponent],
  template: `
    <div class="px-auto">
      <app-header></app-header>
    </div>
    <section class="bg-blue-100 py-12">
      <div class="container mx-auto text-center">
        <h2 class="text-4xl font-bold mb-4">Welcome to the Pokedex!</h2>
        <p class="text-lg text-gray-700">
          Discover, explore, and learn about your favorite Pokémon.
        </p>
        <a
          href="pokemon-list.html"
          class="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          View Pokémon List
        </a>
      </div>
    </section>

    <section class="mb-12">
      <h3 class="text-2xl md:text-3xl font-bold mb-6 text-center">
        Featured Pokémon Trailers
      </h3>
      <div class="relative w-full">
        <div
          class="flex overflow-x-auto space-x-4 pb-4 carousel-container snap-x snap-mandatory w-full"
        >
          @for (item of pokemonCarouselItems(); track $index) {
          <div class="flex-none w-72 md:w-80 snap-start">
            <app-carousel-card [item]="item"></app-carousel-card>
          </div>
          }
        </div>
      </div>
    </section>

    <section class="container mx-auto mb-12">
      <h3 class="text-2xl md:text-3xl font-bold mb-6 text-center">
        Featured Pokémon
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        @for (item of pokemonGridItems(); track $index) {
        <app-item-card [item]="item"></app-item-card>
        }
      </div>
    </section>

    <footer class="bg-gray-800 text-white py-4 text-center">
      <p>&copy; 2025 Sieujs. All rights reserved.</p>
    </footer>
  `,
  styles: `
    :host {
      @apply block container;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  readonly pokemonService = inject(PokemonService);
  readonly pokemonItems$ = this.pokemonService
    .pokemonControllerGetPokemonList({
      page: 1,
      limit: 10,
    })
    .pipe(
      filter((response) => !!response.items),
      map((response) => response.items)
    );

  readonly pokemonItems = toSignal(this.pokemonItems$, {
    initialValue: [],
  });
  readonly pokemonCarouselItems = computed(() => {
    return this.pokemonItems().slice(0, 4);
  });

  readonly pokemonGridItems = computed(() => {
    return this.pokemonItems();
  });
}
