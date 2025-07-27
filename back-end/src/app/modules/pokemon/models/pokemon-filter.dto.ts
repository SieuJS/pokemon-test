import { ApiProperty, PickType } from '@nestjs/swagger';
import { PokemonDTO } from './pokemon.dto';

export class PokemonFilterDTO extends PickType(PokemonDTO, [
  'name',
  'legendary',
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

  @ApiProperty({
    description: 'Filter by primary type',
    example: 'Grass',
    required: false,
  })
  fromSpeed?: number;

  @ApiProperty({
    description: 'Filter by secondary type',
    example: 'Poison',
    required: false,
  })
  toSpeed?: number;

  @ApiProperty({
    description: 'Filter by Pokémon type',
    example: 'Fire',
    required: false,
  })
  type: string;
}
