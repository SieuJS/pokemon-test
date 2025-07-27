import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { File as MulterFile } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { PokemonService } from '../services';
import { PokemonDTO, PokemonFilterDTO, PokemonListDTO } from '../models';
import {
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  PartialType,
} from '@nestjs/swagger';
import { PokemonFilterPipe } from '../pipe/pokemon-filter.pipe';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('list')
  @ApiResponse({
    type: PokemonListDTO,
    status: 200,
    description: 'List of Pokemons',
  })
  @ApiQuery({
    type: PartialType(PokemonFilterDTO),
    required: false,
  })
  async getPokemonList(
    @Query(new PokemonFilterPipe()) filter: Partial<PokemonFilterDTO>
  ): Promise<PokemonListDTO> {
    return this.pokemonService.getPokemonList(filter);
  }

  @Post('import')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV file to import',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 204, description: 'Pokemons imported successfully' })
  async importPokemonCsv(@UploadedFile() file: MulterFile): Promise<void> {
    await this.pokemonService.importPokemonDataFromCsvFile(file);
  }

  @Get('details/:id')
  @ApiResponse({
    type: PokemonDTO,
    status: 200,
    description: 'Pokemon details',
  })
  @ApiResponse({
    status: 404,
    description: 'Pokemon not found',
  })
  async getPokemonDetails(@Param('id') id: string): Promise<PokemonDTO> {
    const pokemon = await this.pokemonService.getPokemonDetails(id);
    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
    return pokemon;
  }
}
