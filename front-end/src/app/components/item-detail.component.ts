import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PokemonDto } from '../api/models';
import { SafeUrlPipe } from '../pipes/safe-url.pipe';

@Component({
  selector: 'app-item-detail',
  imports: [CommonModule, MatDialogModule, SafeUrlPipe],
  template: `
    <h2 mat-dialog-title>{{ data.name || 'Pokemon Details' }}</h2>
    <mat-dialog-content>
      <div [ngStyle]="data.legendary ? {'box-shadow': '0 0 16px 4px gold', 'border': '2px solid gold', 'padding': '8px', 'border-radius': '12px', 'background': 'rgba(255,215,0,0.08)'} : {}" style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
        <ng-container *ngIf="data.legendary">
          <span style="color: #bfa100; font-weight: bold; font-size: 1.1em; letter-spacing: 1px; margin-bottom: 4px; text-shadow: 0 1px 4px #fff7;">★ Legendary Pokémon</span>
        </ng-container>
        <img *ngIf="data.image" [src]="data.image" [alt]="data.name" style="max-width: 200px; border-radius: 8px; box-shadow: 0 2px 8px #0002;" />
        <p style="text-align: center;">ID: {{ data.id }}</p>
        <p style="text-align: center;">Type: {{ data.type1 }}<span *ngIf="data.type2"> / {{ data.type2 }}</span></p>
        <table style="margin: 8px 0; width: auto; border-collapse: collapse;">
          <tr><td><b>Total</b></td><td style="padding-left: 8px;">{{ data.total }}</td></tr>
          <tr><td><b>HP</b></td><td style="padding-left: 8px;">{{ data.hp }}</td></tr>
          <tr><td><b>Attack</b></td><td style="padding-left: 8px;">{{ data.attack }}</td></tr>
          <tr><td><b>Defense</b></td><td style="padding-left: 8px;">{{ data.defense }}</td></tr>
          <tr><td><b>Sp. Attack</b></td><td style="padding-left: 8px;">{{ data.spAttack }}</td></tr>
          <tr><td><b>Sp. Defense</b></td><td style="padding-left: 8px;">{{ data.spDefense }}</td></tr>
          <tr><td><b>Speed</b></td><td style="padding-left: 8px;">{{ data.speed }}</td></tr>
          <tr><td><b>Generation</b></td><td style="padding-left: 8px;">{{ data.generation }}</td></tr>
        </table>
        <div *ngIf="data.ytbUrl" style="width: 100%; display: flex; justify-content: center;">
          <iframe
            [src]="getYoutubeEmbedUrl(data.ytbUrl) | safeUrl"
            width="320"
            height="180"
            frameborder="0"
            allowfullscreen
            style="border-radius: 8px; box-shadow: 0 2px 8px #0002;"
          ></iframe>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: `:host { display: block; min-width: 300px; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetailComponent {
  dialogRef = inject(MatDialogRef<ItemDetailComponent>);
  data = inject<PokemonDto>(MAT_DIALOG_DATA);

  getYoutubeEmbedUrl(url?: string): string | null {
    if (!url) return null;
    // Extract video ID from various YouTube URL formats
    const regExp = /(?:youtube.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu.be\/)([\w-]{11})/;
    const match = url.match(regExp);
    const videoId = match ? match[1] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }
}
