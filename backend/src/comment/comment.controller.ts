import { Controller, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '../auth.guard'; // Vérifie ton chemin d'import

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: { content: string; ressourceId: number; parentId?: number }, @Request() req) {
    console.log("Données reçues :", data); // Ajoute ce log pour vérifier que parentId arrive bien
    return this.commentService.create({
      ...data,
      authorId: req.user.sub,
    });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.commentService.remove(Number(id), req.user.sub);
  }
}