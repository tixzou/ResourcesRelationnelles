import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Anti-abus : 5 inscriptions max par minute et par IP.
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('register')
  async register(@Body() body: RegisterDto) {

    return this.authService.register(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
    );
  }

  // Anti brute-force : 10 tentatives de connexion max par minute et par IP.
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }
}

/**
 * Documentation du fichier
 *
 * - Role : Controleur expose sur /auth. Il recoit les requetes d'inscription et de connexion.
 * - Fonctionnement : Il extrait les champs du body et delegue les controles a AuthService.
 * - A retenir : Il reste volontairement fin : la securite et le hash des mots de passe sont dans le service.
 */
