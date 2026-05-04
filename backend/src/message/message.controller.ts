import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '../auth.guard';

@UseGuards(AuthGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('activity/:ressourceId')
  async sendMessage(
    @Request() req,
    @Param('ressourceId') ressourceId: string,
    @Body() body: { content: string }
  ) {
    return this.messageService.sendMessageToActivity(
      req.user.sub,
      Number(ressourceId),
      body.content
    );
  }

  @Get('activity/:ressourceId')
  async getActivityMessages(@Param('ressourceId') ressourceId: string) {
    return this.messageService.getActivityMessages(Number(ressourceId));
  }
}

/**
 * Documentation du fichier
 *
 * - Role : Controleur du chat d'activite expose sur /message. Toutes ses routes sont protegees par AuthGuard.
 * - Fonctionnement : Il permet d'envoyer un message dans une ressource et de lire l'historique d'une ressource.
 * - A retenir : Il transmet l'id utilisateur issu du JWT au service pour identifier l'expediteur.
 */
