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

  // backend/src/ressource/ressource.service.ts

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
        // On demande explicitement à Prisma de chercher SI ce userId existe dans les favoris de cette ressource
        favoritedBy: {
          where: {
            userId: userId || -1 // Si pas de userId, on cherche un ID impossible
          }
        }
      }
    });

    if (!ressource) return null;

    // La ressource est favorisée si le tableau favoritedBy contient notre entrée
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