import { Controller, Get, Patch, Body, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  findAll() {
    return this.userService.findAllAdmin();
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  updateProfile(@Request() req, @Body() data: { firstName: string; lastName: string; email: string }) {
    return this.userService.updateProfile(req.user.sub, data);
  }

  @UseGuards(AuthGuard)
  @Patch('profile/password')
  updatePassword(@Request() req, @Body() data: any) {
    return this.userService.updatePassword(req.user.sub, data.oldPassword, data.newPassword);
  }
}

/**
 * Documentation du fichier
 *
 * - Role : Controleur utilisateur expose sur /user. Il gere la recuperation globale et les actions liees au profil de l'utilisateur connecte.
 * - Fonctionnement : Il expose des routes protegees par AuthGuard pour consulter le profil, modifier les informations personnelles et changer le mot de passe.
 * - A retenir : La gestion admin reelle est dans admin-user.controller.ts. Les routes de profil necessitent un token JWT valide pour identifier l'utilisateur via req.user.sub.
 */