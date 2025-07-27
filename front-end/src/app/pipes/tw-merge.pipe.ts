import { Pipe, PipeTransform } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Pipe({
  name: 'twMerge',
})
export class TwMergePipe implements PipeTransform {
  transform = twMerge;
}
