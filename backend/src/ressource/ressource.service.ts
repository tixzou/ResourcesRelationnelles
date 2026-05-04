import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RessourceService {
  constructor(private prisma: PrismaService) { }

  // --- CATALOGUE & RECHERCHE ---
  async findAll() {
    return this.prisma.ressource.findMany({
      where: { isPublic: true, isValidated: true },
      include: {
        category: true,
        author: { select: { firstName: true, lastName: true } },
        _count: { select: { favoritedBy: true } }
      }
    });
  }

  async findOne(id: number, userId?: number) {
    if (!id || isNaN(id)) return null;

    // Log de vue (optionnel)
    try {
      await this.prisma.viewLog.create({ data: { ressourceId: id } });
    } catch (e) { }

    const ressource = await this.prisma.ressource.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
        category: true,
        comments: {
          include: { author: { select: { id: true, firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' }
        },
        favoritedBy: {
          where: {
            userId: userId || -1
          }
        }
      }
    });

    if (!ressource) return null;

    const isFavorited = ressource.favoritedBy.length > 0;

    return {
      ...ressource,
      isFavorited
    };
  }

  // --- ACTIONS CITOYEN ---
  async create(createRessourceDto: any, authorId: number) {
    return this.prisma.ressource.create({
      data: {
        title: createRessourceDto.title,
        content: createRessourceDto.content,
        type: createRessourceDto.type,
        authorId: authorId,
        categoryId: createRessourceDto.categoryId ? Number(createRessourceDto.categoryId) : null,
      },
    });
  }

  async findMine(authorId: number) {
    return this.prisma.ressource.findMany({
      where: { authorId },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  // 👇 NOUVELLE MÉTHODE : Modification par l'utilisateur
  async update(id: number, authorId: number, updateData: any) {
    const ressource = await this.prisma.ressource.findUnique({ where: { id } });
    if (!ressource || ressource.authorId !== authorId) {
      throw new UnauthorizedException("Vous n'êtes pas l'auteur de cette ressource ou elle n'existe pas.");
    }

    return this.prisma.ressource.update({
      where: { id },
      data: {
        title: updateData.title,
        content: updateData.content,
        type: updateData.type,
        categoryId: updateData.categoryId ? Number(updateData.categoryId) : null,
        isValidated: false, // La ressource repasse en attente de validation après édition
      },
    });
  }

  // 👇 NOUVELLE MÉTHODE : Suppression par l'utilisateur
  async remove(id: number, authorId: number) {
    const ressource = await this.prisma.ressource.findUnique({ where: { id } });
    if (!ressource || ressource.authorId !== authorId) {
      throw new UnauthorizedException("Vous n'êtes pas l'auteur de cette ressource ou elle n'existe pas.");
    }

    return this.prisma.ressource.delete({ where: { id } });
  }

  async toggleFavorite(ressourceId: number, userId: number) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_ressourceId: { userId, ressourceId } }
    });
    if (existing) return this.prisma.favorite.delete({ where: { id: existing.id } });
    return this.prisma.favorite.create({ data: { userId, ressourceId } });
  }

  async toggleSaved(ressourceId: number, userId: number) {
    const existing = await this.prisma.savedResource.findUnique({
      where: { userId_ressourceId: { userId, ressourceId } }
    });
    if (existing) return this.prisma.savedResource.delete({ where: { id: existing.id } });
    return this.prisma.savedResource.create({ data: { userId, ressourceId } });
  }

  async toggleExploited(ressourceId: number, userId: number) {
    const existing = await this.prisma.exploitedResource.findUnique({
      where: { userId_ressourceId: { userId, ressourceId } }
    });
    if (existing) return this.prisma.exploitedResource.delete({ where: { id: existing.id } });
    return this.prisma.exploitedResource.create({ data: { userId, ressourceId } });
  }

  async joinActivity(ressourceId: number, userId: number) {
    return this.prisma.participation.upsert({
      where: { userId_ressourceId: { userId, ressourceId } },
      update: { status: 'ACCEPTED' },
      create: { userId, ressourceId, status: 'ACCEPTED' }
    });
  }

  async inviteUser(ressourceId: number, targetUserId: number) {
    return this.prisma.participation.create({
      data: { userId: targetUserId, ressourceId, status: 'INVITED' }
    });
  }

  async getProgressionStats(userId: number) {
    const total = await this.prisma.ressource.count({ where: { isValidated: true } });
    const exploited = await this.prisma.exploitedResource.count({ where: { userId } });
    const recent = await this.prisma.exploitedResource.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { ressource: { include: { category: true } } }
    });
    return {
      stats: { totalRessources: total, exploitedCount: exploited, completionRate: total > 0 ? (exploited / total) * 100 : 0 },
      recentExploited: recent
    };
  }

  // 👇 NOUVELLE MÉTHODE : Récupérer les favoris de l'utilisateur
  async findMyFavorites(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        ressource: {
          include: {
            category: true,
            author: { select: { firstName: true, lastName: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // On extrait la ressource de l'objet favorite pour renvoyer un tableau propre
    return favorites.map(fav => ({
      ...fav.ressource,
      isFavorited: true // Par définition, elles sont toutes en favori ici
    }));
  }

  // --- ADMINISTRATION ---
  async findAllAdmin() {
    return this.prisma.ressource.findMany({
      include: { author: true, category: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async validate(id: number) {
    return this.prisma.ressource.update({ where: { id }, data: { isValidated: true } });
  }

  async suspend(id: number) {
    return this.prisma.ressource.update({ where: { id }, data: { isValidated: false } });
  }

  async updateByAdmin(id: number, data: any) {
    return this.prisma.ressource.update({ where: { id }, data });
  }

  async removeByAdmin(id: number) {
    return this.prisma.ressource.delete({ where: { id } });
  }
}