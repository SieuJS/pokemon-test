import { Module } from '@nestjs/common';
import { PokemonFavoriteService } from './services/pokemon-favorite.service';
import { PokemonFavoriteController } from './controllers/pokemon-favorite.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  providers: [PokemonFavoriteService, PrismaService],
  controllers: [PokemonFavoriteController],
})
export class PokemonFavoriteModule {}
