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

  // 👇 NOUVELLE ROUTE : Création d'une ressource
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createRessourceDto: any, @Request() req) {
    return this.ressourceService.create(createRessourceDto, req.user.sub);
  }

  // 👇 NOUVELLE ROUTE : Modification d'une ressource
  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: any, @Request() req) {
    return this.ressourceService.update(+id, req.user.sub, updateData);
  }

  // 👇 NOUVELLE ROUTE : Suppression d'une ressource
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.ressourceService.remove(+id, req.user.sub);
  }

  // Attention : toujours garder les routes paramétrées (comme :id) APRES les routes fixes (comme 'me' ou 'progression')
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
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