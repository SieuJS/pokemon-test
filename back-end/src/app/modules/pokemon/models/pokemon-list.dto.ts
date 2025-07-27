import { ApiProperty, PickType } from '@nestjs/swagger';
import { PokemonDTO } from './pokemon.dto';
import { Prisma } from '@prisma/client';

export class PokemonListItemDTO extends PickType(PokemonDTO, [
  'id',
  'name',
  'image',
  'ytbUrl',
]) {
  constructor(
    instance: Prisma.PokemonGetPayload<{
      select: {
        id: true;
        name: true;
        image: true;
        ytbUrl: true;
      };
    }>
  ) {
    super();
    this.id = instance.id;
    this.name = instance.name;
    this.image = instance.image;
    this.ytbUrl = instance.ytbUrl;
  }
}

export class PaginationDTO {
  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total number of items', example: 100 })
  total: number;

  @ApiProperty({
    description: 'Previous page number',
    example: 1,
    required: false,
  })
  prev?: number;

  @ApiProperty({ description: 'Next page number', example: 3, required: false })
  next?: number;
}

export class PokemonListDTO {
  @ApiProperty({
    type: [PokemonListItemDTO],
    description: 'List of Pokémon items',
  })
  items: PokemonListItemDTO[];
  @ApiProperty({ type: PaginationDTO, description: 'Pagination metadata' })
  meta: PaginationDTO;
}
