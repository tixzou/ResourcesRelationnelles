import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) { }

  async create(data: { content: string; ressourceId: number; authorId: number; parentId?: number }) {
    return this.prisma.comment.create({
      data: {
        content: data.content,
        ressourceId: data.ressourceId,
        authorId: data.authorId,
        parentId: data.parentId || null,
      },
      include: {
        author: { select: { firstName: true, lastName: true } }
      }
    });
  }

  async remove(id: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) throw new NotFoundException('Commentaire introuvable');

    if (comment.authorId !== userId) {
      throw new ForbiddenException("Vous n'avez pas l'autorisation de supprimer ce commentaire");
    }

    return this.prisma.comment.delete({
      where: { id }
    });
  }
  async removeByAdmin(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) throw new NotFoundException('Commentaire introuvable');

    return this.prisma.comment.delete({
      where: { id }
    });
  }

  async findByRessource(ressourceId: number) {
    return this.prisma.comment.findMany({
      where: { ressourceId },
      include: {
        author: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
  }
}

/**
 * Documentation du fichier
 *
 * - Role : Service metier des commentaires. Il cree des commentaires ou reponses rattaches a une ressource et a un auteur.
 * - Fonctionnement : Il controle qu'un utilisateur ne supprime que ses propres commentaires, sauf via la methode admin.
 * - A retenir : Il liste les commentaires d'une ressource dans l'ordre chronologique avec les informations auteur.
 */
