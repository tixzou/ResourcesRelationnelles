import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

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

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, email: true, role: true }
    });
    if (!user) throw new NotFoundException("Utilisateur introuvable");
    
    return user;
  }

  async updateProfile(userId: number, data: { firstName: string; lastName: string; email: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing && existing.id !== userId) {
      throw new BadRequestException("Cet email est déjà utilisé.");
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { firstName: data.firstName, lastName: data.lastName, email: data.email },
      select: { id: true, firstName: true, lastName: true, email: true }
    });
  }

  async updatePassword(userId: number, oldPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("Utilisateur introuvable");

    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) throw new BadRequestException("Mot de passe actuel incorrect");

    const hashedNewPassword = await bcrypt.hash(newPass, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    return { message: "Mot de passe mis à jour avec succès" };
  }
}

/**
 * Documentation du fichier
 *
 * - Role : Service metier des utilisateurs. Il gere l'administration des comptes (liste, roles, statut) et la gestion du profil utilisateur.
 * - Fonctionnement : Il permet de changer le role, supprimer un utilisateur, inverser son etat actif/suspendu, ainsi que de consulter et mettre a jour les informations personnelles et le mot de passe du profil courant.
 * - A retenir : Les erreurs Prisma sont converties en exceptions Nest. La modification du profil verifie l'unicite de l'email et la mise a jour du mot de passe valide l'ancien hash avec bcrypt.
 */