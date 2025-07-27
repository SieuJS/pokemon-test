import { OmitType } from "@nestjs/swagger";
import { PokemonDTO } from "./pokemon.dto";

export class PokemonImportDTO extends OmitType( PokemonDTO, ['id']){
    
}