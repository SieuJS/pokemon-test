import { ApiProperty, PickType } from '@nestjs/swagger';
import { PokemonDTO } from './pokemon.dto';

export class PokemonFilterDTO extends PickType(PokemonDTO, [
  'name',
  'legendary',
  'speed',
]) {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page?: number;
  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit?: number;
}
