import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './modules/common/common.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonModule } from './modules/pokemon/pokemon.module';
import { PokemonFavoriteModule } from './modules/pokemon-favorite/pokemon-favorite.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    CommonModule,
    UserModule,
    AuthModule,
    PokemonModule,
    PokemonFavoriteModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
