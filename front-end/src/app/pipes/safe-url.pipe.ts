import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'safeUrl', standalone: true })
export class SafeUrlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  transform(url: string | null | undefined): SafeResourceUrl | null {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '');
      if (host === 'youtube.com' || host === 'youtu.be') {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
      return null;
    } catch {
      return null;
    }
  }
}
