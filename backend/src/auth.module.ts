import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [JwtModule, ConfigModule],
})
export class AuthModule { }

/**
 * Documentation du fichier
 *
 * - Role : Module d'authentification. Il configure ConfigModule et JwtModule avec la cle JWT issue de l'environnement.
 * - Fonctionnement : Il declare AuthController, AuthService et PrismaService pour permettre inscription et connexion.
 * - A retenir : Il exporte JwtModule et ConfigModule afin que les guards et autres modules puissent reutiliser la configuration.
 */
