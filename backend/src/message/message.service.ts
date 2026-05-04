import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async sendMessageToActivity(senderId: number, ressourceId: number, content: string) {
    return this.prisma.message.create({
      data: {
        content,
        senderId,
        ressourceId,
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true } }
      }
    });
  }

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

/**
 * Documentation du fichier
 *
 * - Role : Service de messagerie. Il cree un message avec contenu, expediteur et ressource cible.
 * - Fonctionnement : Il inclut les informations de l'expediteur dans la reponse pour affichage frontend.
 * - A retenir : Il recupere l'historique des messages dans l'ordre de creation ascendant.
 */
