import { Controller, Post, Delete, Body, Param, Request, UseGuards, Get } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '../auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: { content: string; ressourceId: number; parentId?: number }, @Request() req) {
    console.log("Données reçues :", data);
    return this.commentService.create({
      ...data,
      authorId: req.user.sub,
    });
  }

  // 👇 NOUVELLE ROUTE : Suppression par un administrateur (À mettre AVANT le @Delete(':id') classique)
  @UseGuards(AuthGuard)
  @Delete('admin/:id')
  async removeByAdmin(@Param('id') id: string) {
    return this.commentService.removeByAdmin(Number(id));
  }

  // Route classique de suppression (réservée à l'auteur du commentaire)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.commentService.remove(Number(id), req.user.sub);
  }
  
  @Get('ressource/:id')
  async getByRessource(@Param('id') id: string) {
    return this.commentService.findByRessource(Number(id));
  }
}