import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class PokemonDTO {
  @ApiProperty({ description: 'Unique identifier for the Pokémon', example: 'b1a2c3d4-e5f6-7890-abcd-1234567890ab' })
  id: string;

  @ApiProperty({ description: 'Name of the Pokémon', example: 'Bulbasaur' })
  name: string;

  @ApiProperty({ description: 'Primary type of the Pokémon', example: 'Grass' })
  type1: string;

  @ApiProperty({ description: 'Secondary type of the Pokémon', example: 'Poison', required: false })
  type2?: string;

  @ApiProperty({ description: 'Total base stats', example: 318 })
  total: number;

  @ApiProperty({ description: 'HP stat', example: 45 })
  hp: number;

  @ApiProperty({ description: 'Attack stat', example: 49 })
  attack: number;

  @ApiProperty({ description: 'Defense stat', example: 49 })
  defense: number;

  @ApiProperty({ description: 'Special Attack stat', example: 65 })
  spAttack: number;

  @ApiProperty({ description: 'Special Defense stat', example: 65 })
  spDefense: number;

  @ApiProperty({ description: 'Speed stat', example: 45 })
  speed: number;

  @ApiProperty({ description: 'Generation number', example: 1 })
  generation: number;

  @ApiProperty({ description: 'Is this Pokémon legendary?', example: false })
  legendary: boolean;

  @ApiProperty({ description: 'Image URL of the Pokémon', example: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png' })
  image: string;

  @ApiProperty({ description: 'YouTube URL for the Pokémon', example: 'https://youtube.com/watch?v=example' })
  ytbUrl: string;

  constructor(instance : Prisma.PokemonGetPayload<true>) {
    this.id = instance.id;
    this.name = instance.name;
    this.type1 = instance.type1;
    this.type2 = instance.type2;
    this.total = instance.total;
    this.hp = instance.hp;
    this.attack = instance.attack;
    this.defense = instance.defense;
    this.spAttack = instance.spAttack;
    this.spDefense = instance.spDefense;
    this.speed = instance.speed;
    this.generation = instance.generation;
    this.legendary = instance.legendary;
    this.image = instance.image;
    this.ytbUrl = instance.ytbUrl;
  }
}