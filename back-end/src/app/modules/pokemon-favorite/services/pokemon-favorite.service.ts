import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common';
import { PokemonFavoriteDTO, AddPokemonFavoriteDTO } from '../models';

@Injectable()
export class PokemonFavoriteService {
  constructor(private readonly prismaService: PrismaService) {}

  async addFavorite(userId: string, dto: AddPokemonFavoriteDTO): Promise<PokemonFavoriteDTO> {
    const favorite = await this.prismaService.pokemonFavorite.create({
      data: {
        userId,
        pokemonId: dto.pokemonId,
      },
    });
    return favorite;
  }

  async removeFavorite(userId: string, pokemonId: string): Promise<void> {
    await this.prismaService.pokemonFavorite.delete({
      where: {
        userId_pokemonId: {
          userId,
          pokemonId,
        },
      },
    });
  }

  async getFavoritesByUser(userId: string) {
    return this.prismaService.pokemonFavorite.findMany({
      where: { userId },
      include: { pokemon: true },
    });
  }
}
