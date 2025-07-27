import { Injectable, Param } from '@nestjs/common';
import { PrismaService } from '../../common';
import { PokemonDTO, PokemonFilterDTO, PokemonListDTO } from '../models';
import { Prisma } from '@prisma/client';
import { PokemonImportDTO } from '../models/pokemon-import.dto';
import { File as MulterFile } from 'multer';

import * as Papa from 'papaparse';

@Injectable()
export class PokemonService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPokemonList(filter: Partial<PokemonFilterDTO>): Promise<PokemonListDTO> {
    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit = filter.limit && filter.limit > 0 ? filter.limit : 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PokemonWhereInput = {};
    if (filter.name) {
      where.name = { contains: filter.name, mode: 'insensitive' };
    }
    if (filter.legendary !== undefined) {
      where.legendary = filter.legendary;
    }
    if (filter.fromSpeed !== undefined) {
      where.speed = { gte: filter.fromSpeed };
    }
    if (filter.toSpeed !== undefined) {
      where.speed = { lte: filter.toSpeed };
    }
    if (filter.type) {
      where.type1 = {
        equals: filter.type,
        mode: 'insensitive',
      }
      where.type2 = {
        equals: filter.type,
        mode: 'insensitive',
      };
    }

    const [items, total] = await Promise.all([
      this.prismaService.pokemon.findMany({
        where,
        select: {
          id: true,
          name: true,
          image: true,
          ytbUrl: true,
        },
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prismaService.pokemon.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        prev: page > 1 ? page - 1 : undefined,
        next: skip + limit < total ? page + 1 : undefined,
      },
    };
  }

  async getPokemonDetails(id: string): Promise<PokemonDTO | null> {
    return this.prismaService.pokemon.findUnique({
      where: { id },
    });
  }

  async importPokemonData(data: PokemonImportDTO[]): Promise<void> {
    await this.prismaService.$transaction([
      this.prismaService.pokemon.createMany({
        data,
        skipDuplicates: true,
      })
    ]);
  }

  async importPokemonDataFromCsvFile(file: MulterFile): Promise<void> {
    if (!file || !file.buffer) {
      throw new Error('No file provided or file buffer is missing');
    }
    const csvString = file.buffer.toString('utf-8');
    const parsed = Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
    });
    if (parsed.errors && parsed.errors.length > 0) {
      throw new Error('CSV parsing error: ' + parsed.errors.map(e => e.message).join(', '));
    }

    const transformedData: PokemonImportDTO[] = (parsed.data as PokemonImportDTO[]).map((row) => ({
      name: row.name,
      type1: row.type1,
      type2: row.type2 || null,
      total: row.total ? Number(row.total) : undefined,
      hp: row.hp ? Number(row.hp) : undefined,
      attack: row.attack ? Number(row.attack) : undefined,
      defense: row.defense ? Number(row.defense) : undefined,
      spAttack: row.spAttack ? Number(row.spAttack) : undefined,
      spDefense: row.spDefense ? Number(row.spDefense) : undefined,
      speed: row.speed ? Number(row.speed) : undefined,
      generation: row.generation ? Number(row.generation) : undefined,
      legendary: typeof row.legendary === 'boolean' ? row.legendary : String(row.legendary).toLowerCase() === 'true',
      image: row.image,
      ytbUrl: row.ytbUrl,
    }));
    await this.importPokemonData(transformedData);
  }

  async getPokemonById(id: string): Promise<PokemonImportDTO | null> {
    return this.prismaService.pokemon.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        type1: true,
        type2: true,
        total: true,
        hp: true,
        attack: true,
        defense: true,
        spAttack: true,
        spDefense: true,
        speed: true,
        generation: true,
        legendary: true,
        image: true,
        ytbUrl: true,
      },
    });
  }
}
