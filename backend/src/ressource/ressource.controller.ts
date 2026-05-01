import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RessourceService } from './ressource.service';
import { CreateRessourceDto } from './dto/create-ressource.dto';
import { AuthGuard } from '../auth.guard';

@Controller('ressource')
export class RessourceController {
  constructor(private readonly ressourceService: RessourceService) { }

  // Créer une ressource
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createRessourceDto: CreateRessourceDto, @Request() req) {
    return this.ressourceService.create(createRessourceDto, req.user.sub);
  }

  // 👇 LA VOICI ! La route qui te manquait pour "Mes ressources" 👇
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  findMine(@Request() req) {
    return this.ressourceService.findMine(req.user.sub);
  }

  // Récupérer le catalogue public
  @Get()
  findAll() {
    return this.ressourceService.findAll();
  }

  // 👇 IL TE MANQUAIT AUSSI LA MODIFICATION 👇
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: any, @Request() req) {
    return this.ressourceService.update(+id, updateData, req.user.sub);
  }

  // Supprimer une ressource
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.ressourceService.remove(+id, req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ressourceService.findOne(+id); // Le "+" est CRUCIAL pour transformer "1" en 1
  }
}