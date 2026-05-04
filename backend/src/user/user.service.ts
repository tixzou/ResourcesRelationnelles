import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async findAllAdmin() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { ressources: true, comments: true }
        }
      }
    });
  }

  async updateRole(id: number, newRole: Role) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("Utilisateur non trouvé");

    return this.prisma.user.update({
      where: { id },
      data: { role: newRole },
    });
  }

  async remove(id: number) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (e) {
      throw new NotFoundException("Impossible de supprimer cet utilisateur");
    }
  }

  async toggleActive(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("Utilisateur non trouvé");

    return this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });
  }
}

/**
 * Documentation du fichier
 *
 * - Role : Service metier des utilisateurs. Il liste les comptes avec compteurs de ressources/commentaires pour l'administration.
 * - Fonctionnement : Il permet de changer le role, supprimer un utilisateur et inverser son etat actif/suspendu.
 * - A retenir : Les erreurs Prisma sont converties en exceptions Nest quand l'utilisateur n'existe pas ou ne peut pas etre supprime.
 */
