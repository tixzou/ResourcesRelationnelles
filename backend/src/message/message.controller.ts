import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '../auth.guard';

@UseGuards(AuthGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // POST /message/activity/:ressourceId
  // Envoie un message dans le contexte d'une activité/ressource
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

  // GET /message/activity/:ressourceId
  // Récupère le fil de discussion complet d'une ressource
  @Get('activity/:ressourceId')
  async getActivityMessages(@Param('ressourceId') ressourceId: string) {
    return this.messageService.getActivityMessages(Number(ressourceId));
  }
}