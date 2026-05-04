import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  // 1. Envoyer un message dans le chat d'une ressource/activité
  async sendMessageToActivity(senderId: number, ressourceId: number, content: string) {
    return this.prisma.message.create({
      data: {
        content,
        senderId,
        ressourceId, // Doit être un number obligatoire selon ton schéma
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true } }
      }
    });
  }

  // 2. Récupérer tout l'historique du chat d'une activité
  async getActivityMessages(ressourceId: number) {
    return this.prisma.message.findMany({
      where: { ressourceId },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
  }
}