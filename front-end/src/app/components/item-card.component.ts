import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonListItemDto } from '../api/models';
import { ImageFallbackDirective } from '../directives/fallback-image.directive';

@Component({
  selector: 'app-item-card',
  imports: [CommonModule, ImageFallbackDirective],
  template: `
          <div class="pokemon-card bg-white rounded-lg shadow-md overflow-hidden">
            <img [src]="item()?.image" alt="Bulbasaur" class="w-full h-48 object-center" [fallback]="fallBack">
            <div class="p-4">
                <h4 class="font-bold text-lg">{{ item()?.name }}</h4>
            </div>
        </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardComponent {
  readonly fallBack = '/assets/fallback.png';
  readonly item = input<PokemonListItemDto>();
}
