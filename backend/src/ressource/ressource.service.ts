import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RessourceService {
  constructor(private prisma: PrismaService) { }

  // 1. Créer une nouvelle ressource
  create(createRessourceDto: any, authorId: number) {
    return this.prisma.ressource.create({
      data: {
        title: createRessourceDto.title,
        content: createRessourceDto.content,
        type: createRessourceDto.type,
        isPublic: createRessourceDto.isPublic ?? true,
        authorId: authorId,
        categoryId: createRessourceDto.categoryId,
      },
    });
  }

  // 2. Récupérer toutes les ressources publiques (Catalogue)
  findAll() {
    return this.prisma.ressource.findMany({
      where: { isPublic: true, isValidated: true },
      include: {
        category: true,
        author: {
          select: { firstName: true, lastName: true }
        }
      }
    });
  }
  async findEnAttente() {
    return this.prisma.ressource.findMany({
      where: { isValidated: false },
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: { firstName: true, lastName: true, email: true } },
        category: true,
      },
    });
  }

  async validate(id: number) {
    return this.prisma.ressource.update({
      where: { id },
      data: { isValidated: true },
    });
  }

  // (Optionnel) NOUVEAU : Rejeter/Supprimer une ressource
  async reject(id: number) {
    return this.prisma.ressource.delete({
      where: { id },
    });
  }

  // backend/src/ressource/ressource.service.ts
  async findOne(id: number, userId?: number) {
    await this.prisma.viewLog.create({ data: { ressourceId: id } });
    const ressource = await this.prisma.ressource.findUnique({
      where: { id },
      include: {
        author: { select: { firstName: true, lastName: true } },
        category: true,
        comments: { include: { author: { select: { firstName: true, lastName: true } } } }
      }
    });

    if (!ressource) return null;

    let isFavorited = false;
    if (userId) {
      const favorite = await this.prisma.favorite.findUnique({
        where: { userId_ressourceId: { userId, ressourceId: id } }
      });
      isFavorited = !!favorite;
    }

    return { ...ressource, isFavorited };
  }

  // 4. Récupérer les ressources du citoyen connecté
  findMine(authorId: number) {
    return this.prisma.ressource.findMany({
      where: { authorId: authorId },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  // 5. Mettre à jour une ressource
  async update(id: number, updateData: any, authorId: number) {
    const ressource = await this.prisma.ressource.findUnique({
      where: { id }
    });

    if (!ressource || ressource.authorId !== authorId) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à modifier cette ressource.");
    }

    return this.prisma.ressource.update({
      where: { id },
      data: {
        title: updateData.title,
        content: updateData.content,
        type: updateData.type,
        isPublic: updateData.isPublic,
        categoryId: updateData.categoryId,
      },
    });
  }

  // 6. Supprimer une ressource
  async remove(id: number, authorId: number) {
    const ressource = await this.prisma.ressource.findUnique({
      where: { id }
    });

    if (!ressource || ressource.authorId !== authorId) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à supprimer cette ressource.");
    }

    return this.prisma.ressource.delete({
      where: { id }
    });
  }
  // Favoris
  async toggleFavorite(ressourceId: number, userId: number) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_ressourceId: { userId, ressourceId } }
    });

    if (existing) {
      return this.prisma.favorite.delete({ where: { id: existing.id } });
    }

    return this.prisma.favorite.create({
      data: { userId, ressourceId }
    });
  }
  // Mes favoris
  async findFavorites(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { ressource: { include: { category: true, author: true } } }
    });
  }

  // Mettre de côté / Annuler
  async toggleSaved(ressourceId: number, userId: number) {
    const existing = await this.prisma.savedResource.findUnique({
      where: { userId_ressourceId: { userId, ressourceId } }
    });

    if (existing) {
      // Si elle est déjà mise de côté, on l'annule (on supprime la ligne)
      return this.prisma.savedResource.delete({ where: { id: existing.id } });
    }

    // Sinon, on l'ajoute à la liste à lire plus tard[cite: 2]
    return this.prisma.savedResource.create({
      data: { userId, ressourceId }
    });
  }

  // Récupérer la liste "À lire plus tard" de l'utilisateur
  async findSaved(userId: number) {
    return this.prisma.savedResource.findMany({
      where: { userId },
      include: {
        ressource: {
          include: { category: true, author: { select: { firstName: true, lastName: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}