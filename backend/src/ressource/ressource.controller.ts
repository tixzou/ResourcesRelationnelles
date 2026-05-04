// backend/src/ressource/ressource.controller.ts
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

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    // Le userId est optionnel pour vérifier si c'est en favori
    return this.ressourceService.findOne(+id, req.user?.sub);
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