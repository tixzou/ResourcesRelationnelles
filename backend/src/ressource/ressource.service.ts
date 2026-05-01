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
      where: { isPublic: true },
      include: {
        category: true,
        author: {
          select: { firstName: true, lastName: true }
        }
      }
    });
  }

  // backend/src/ressource/ressource.service.ts
  async findOne(id: number) {
    return this.prisma.ressource.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        comments: {
          include: {
            author: {
              select: {
                id: true, // <--- CRUCIAL : L'ID doit être inclus ici
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  // 👇 LES NOUVEAUTÉS QUI TE MANQUAIENT 👇

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
}