import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  findAll() {
    return this.userService.findAllAdmin();
  }
}

/**
 * Documentation du fichier
 *
 * - Role : Controleur utilisateur public expose sur /user. Il est actuellement minimal.
 * - Fonctionnement : Il peut servir de base pour des routes de profil utilisateur non administratives.
 * - A retenir : La gestion admin reelle est dans admin-user.controller.ts.
 */
