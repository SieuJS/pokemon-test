import { Module } from "@nestjs/common";
import { CommonModule } from "../common";
import { PokemonController } from "./controllers";
import { PokemonService } from "./services";

@Module({
  imports: [CommonModule],
  controllers: [PokemonController],
  providers: [PokemonService],
  exports: [],
})
export class PokemonModule {}
