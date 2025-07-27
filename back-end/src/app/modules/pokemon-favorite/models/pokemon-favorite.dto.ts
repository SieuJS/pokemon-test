import { ApiProperty } from '@nestjs/swagger';

export class PokemonFavoriteDTO {
  @ApiProperty({ description: 'Favorite ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'User ID', example: 'uuid' })
  userId: string;

  @ApiProperty({ description: 'Pokemon ID', example: 'uuid' })
  pokemonId: string;
}

export class AddPokemonFavoriteDTO {
  @ApiProperty({ description: 'Pokemon ID', example: 'uuid' })
  pokemonId: string;
}
