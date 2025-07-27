import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { PokemonFavoriteService } from '../services/pokemon-favorite.service';
import { AddPokemonFavoriteDTO } from '../models';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('pokemon-favorite')
@UseGuards(AuthGuard)
export class PokemonFavoriteController {
  constructor(private readonly favoriteService: PokemonFavoriteService) {}

  @Post(':pokemonId')
  @ApiBody({
    type: AddPokemonFavoriteDTO,
    description: 'DTO for adding a Pokemon to favorites',
    required: true,
  })
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 201,
    description: 'Pokemon added to favorites successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Pokemon is already in favorites',
  })
  async addFavorite(@Req() req, @Param() pokemonId: string) {
    const userId = req.user.id;
    const favorites = await this.favoriteService.getFavoritesByUser(userId);
    if (favorites.some((fav) => fav.pokemonId === pokemonId)) {
      throw new BadRequestException('Pokemon is already in favorites');
    }
    try {
      await this.favoriteService.addFavorite(userId, { pokemonId });
    } catch (error) {
      throw new BadRequestException('Failed to add Pokemon to favorites');
    }
    return;
  }

  @Delete(':pokemonId')
  @ApiResponse({
    status: 200,
    description: 'Pokemon removed from favorites successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Pokemon is not in favorites',
  })
  @UseGuards(AuthGuard)
  async removeFavorite(@Req() req, @Param('pokemonId') pokemonId: string) {
    const userId = req.user.id;
    const favorites = await this.favoriteService.getFavoritesByUser(userId);
    if (!favorites.some((fav) => fav.pokemonId === pokemonId)) {
      throw new BadRequestException('Pokemon is not in favorites');
    }
    await this.favoriteService.removeFavorite(userId, pokemonId);
    return { message: 'Pokemon removed from favorites successfully' };
  }

  @Get()
  async getFavorites(@Req() req) {
    return this.favoriteService.getFavoritesByUser(req.user.id);
  }
}
