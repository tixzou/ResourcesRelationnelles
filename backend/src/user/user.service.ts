import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  // Liste pour l'admin (avec plus d'infos)
  async findAllAdmin() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { ressources: true, comments: true } // Stats par utilisateur
        }
      }
    });
  }

  // Changer le rôle d'un utilisateur
  async updateRole(id: number, newRole: Role) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("Utilisateur non trouvé");

    return this.prisma.user.update({
      where: { id },
      data: { role: newRole },
    });
  }

  // Supprimer un utilisateur
  async remove(id: number) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (e) {
      throw new NotFoundException("Impossible de supprimer cet utilisateur");
    }
  }
}