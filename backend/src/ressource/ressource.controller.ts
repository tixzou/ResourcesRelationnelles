import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { RessourceService } from './ressource.service';
import { AuthGuard } from '../auth.guard';

@Controller('ressource')
export class RessourceController {
  constructor(private readonly ressourceService: RessourceService) {}

  @Get()
  findAll() {
    return this.ressourceService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('me')
  findMine(@Request() req) {
    return this.ressourceService.findMine(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('progression')
  getStats(@Request() req) {
    return this.ressourceService.getProgressionStats(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('favorites/me')
  findMyFavorites(@Request() req) {
    return this.ressourceService.findMyFavorites(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createRessourceDto: any, @Request() req) {
    return this.ressourceService.create(createRessourceDto, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: any, @Request() req) {
    return this.ressourceService.update(+id, req.user.sub, updateData);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.ressourceService.remove(+id, req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    let userId = undefined;

    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {

        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

        userId = payload.sub || payload.userId || payload.id;
      } catch (e) {

      }
    }

    return this.ressourceService.findOne(+id, userId);
  }

  @UseGuards(AuthGuard)
  @Post(':id/favorite')
  toggleFavorite(@Param('id') id: string, @Request() req) {
    return this.ressourceService.toggleFavorite(+id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post(':id/save')
  toggleSaved(@Param('id') id: string, @Request() req) {
    return this.ressourceService.toggleSaved(+id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post(':id/exploit')
  toggleExploited(@Param('id') id: string, @Request() req) {
    return this.ressourceService.toggleExploited(+id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post(':id/join')
  join(@Param('id') id: string, @Request() req) {
    return this.ressourceService.joinActivity(+id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post(':id/invite')
  invite(@Param('id') id: string, @Body('targetUserId') targetUserId: number) {
    return this.ressourceService.inviteUser(+id, targetUserId);
  }
}

/**
 * Documentation du fichier
 *
 * - Role : Controleur des ressources expose sur /ressource. Il regroupe routes publiques, connectees et actions utilisateur.
 * - Fonctionnement : Il gere le catalogue, le detail, les ressources personnelles, creation, edition, suppression, favoris, sauvegarde, exploitation et participation.
 * - A retenir : La route detail decode optionnellement un token pour savoir si la ressource est favorite sans exiger une connexion.
 */
