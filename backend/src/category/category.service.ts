import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
      },
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id }
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name,
      },
    });
  }

  remove(id: number) {
    return this.prisma.category.delete({
      where: { id }
    });
  }
}

/**
 * Documentation du fichier
 *
 * - Role : Service CRUD des categories. Il cree une categorie, liste toutes les categories par nom ascendant, recupere, modifie et supprime.
 * - Fonctionnement : Il encapsule les appels Prisma pour eviter de mettre la logique SQL dans le controleur.
 * - A retenir : Il est utilise par le frontend pour les filtres et par l'admin pour organiser le catalogue.
 */
