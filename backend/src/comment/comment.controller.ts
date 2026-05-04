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

  @UseGuards(AuthGuard)
  @Delete('admin/:id')
  async removeByAdmin(@Param('id') id: string) {
    return this.commentService.removeByAdmin(Number(id));
  }

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

/**
 * Documentation du fichier
 *
 * - Role : Controleur des commentaires expose sur /comment. Il gere creation, suppression auteur, suppression admin et lecture par ressource.
 * - Fonctionnement : Les routes d'ecriture sont protegees par AuthGuard afin d'identifier l'utilisateur connecte.
 * - A retenir : La route admin/:id existe pour permettre la moderation depuis l'interface admin.
 */
