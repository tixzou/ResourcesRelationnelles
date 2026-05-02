import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RessourceService } from './ressource.service';
import { CreateRessourceDto } from './dto/create-ressource.dto';
import { AuthGuard } from '../auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('ressource')
export class RessourceController {
  constructor(
    private readonly ressourceService: RessourceService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  // Créer une ressource
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createRessourceDto: CreateRessourceDto, @Request() req) {
    return this.ressourceService.create(createRessourceDto, req.user.sub);
  }

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

  // Mettre de côté ou annuler une ressource
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post(':id/save')
  toggleSaved(@Param('id') id: string, @Request() req) {
    return this.ressourceService.toggleSaved(+id, req.user.sub);
  }
  // Mes ressources mises de côté
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('saved/me')
  getSaved(@Request() req) {
    return this.ressourceService.findSaved(req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    let userId: number | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });

        // On s'assure que userId est un nombre pour Prisma
        userId = Number(payload.sub);
      } catch (e) {
        userId = undefined;
      }
    }

    return this.ressourceService.findOne(+id, userId);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post(':id/favorite')
  toggleFavorite(@Param('id') id: string, @Request() req) {
    return this.ressourceService.toggleFavorite(+id, req.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('favorites/me')
  getFavorites(@Request() req) {
    return this.ressourceService.findFavorites(req.user.sub);
  }


}