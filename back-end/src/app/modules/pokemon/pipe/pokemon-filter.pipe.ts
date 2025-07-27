
import { PipeTransform, Injectable} from '@nestjs/common';
import { PokemonFilterDTO } from '../models';

@Injectable()
export class PokemonFilterPipe implements PipeTransform {
  transform(value: PokemonFilterDTO, ): PokemonFilterDTO {
    const filter: any = { ...value };

    ['page', 'limit', 'speed'].forEach((key) => {
      if (filter[key] !== undefined) {
        const num = Number(filter[key]);
        if (!isNaN(num)) filter[key] = num;
      }
    });

    if (filter.legendary !== undefined) {
      if (typeof filter.legendary === 'string') {
        filter.legendary = filter.legendary.toLowerCase() === 'true';
      } else {
        filter.legendary = Boolean(filter.legendary);
      }
    }

    return filter;
  }
}
