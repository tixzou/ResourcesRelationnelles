import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RessourceService {
  constructor(private prisma: PrismaService) { }

  // Créer une nouvelle ressource
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

  // Récupérer toutes les ressources
  findAll() {
    return this.prisma.ressource.findMany({
      where: { isPublic: true }, // Seulement les ressources publiques
      include: {
        category: true,
        author: {       //  juste le prénom et nom de l'auteur
          select: { firstName: true, lastName: true }
        }
      }
    });
  }

  // Récupérer une seule ressource par son ID
  findOne(id: number) {
    return this.prisma.ressource.findUnique({
      where: { id },
      include: { category: true, author: { select: { firstName: true, lastName: true } } }
    });
  }
}