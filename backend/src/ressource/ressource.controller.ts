import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RessourceService } from './ressource.service';
import { CreateRessourceDto } from './dto/create-ressource.dto';
import { AuthGuard } from '../auth.guard';

@Controller('ressource')
export class RessourceController {
  constructor(private readonly ressourceService: RessourceService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createRessourceDto: CreateRessourceDto, @Request() req) {
    return this.ressourceService.create(createRessourceDto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.ressourceService.findAll();
  }
}