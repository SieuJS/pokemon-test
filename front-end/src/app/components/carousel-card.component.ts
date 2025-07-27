import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonListItemDto } from '../api/models';
import { SafeUrlPipe } from "../pipes/safe-url.pipe";
@Component({
  selector: 'app-carousel-card',
  imports: [CommonModule, SafeUrlPipe],
  template: `
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="aspect-video bg-gray-200 flex items-center justify-center">
        <ng-container *ngIf="item()?.ytbUrl; else iconTpl">
          <iframe
            [src]="youtubeEmbedUrl() | safeUrl"
            width="100%"
            height="100%"
            frameborder="0"
            allowfullscreen
            class="w-full h-full rounded"
          ></iframe>
        </ng-container>
        <ng-template #iconTpl>
          <i class="fas fa-play-circle text-4xl md:text-6xl text-gray-400"></i>
        </ng-template>
      </div>
      <div class="p-3 md:p-4">
        <h4 class="font-bold text-base md:text-lg">{{ item()?.name }}</h4>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselCardComponent {
  readonly item = input<PokemonListItemDto>();

  youtubeThumbnailUrl = computed(() => {
    const url = this.item()?.ytbUrl;
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    const videoId = match ? match[1] : '';
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
  });

  youtubeEmbedUrl = computed(() => {
    const url = this.item()?.ytbUrl;
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    const videoId = match ? match[1] : '';
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  });
}
