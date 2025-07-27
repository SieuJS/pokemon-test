import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { PokemonFavoriteService } from '../services/pokemon-favorite.service';
import { AddPokemonFavoriteDTO, PokemonFavoriteDTO } from '../models';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

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
  @ApiBearerAuth('access-token')
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
  @ApiBearerAuth('access-token')
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
  @ApiResponse({
    status: 200,
    description: 'Returns the list of favorite Pokemon for the user',
    type: [PokemonFavoriteDTO],
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async getFavorites(@Req() req) {
console.log('[PokemonFavoriteController] Fetching favorites for user:', req.user.id);
    return this.favoriteService.getFavoritesByUser(req.user.id);
  }
}
