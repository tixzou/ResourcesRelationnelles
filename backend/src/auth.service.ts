import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Cet email est déjà utilisé.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    return this.generateToken(user);
  }

  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Ce compte a été suspendu par un administrateur.');
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    return this.generateToken(user);
  }

  private async generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async updatePassword(userId: number, oldPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Utilisateur non trouvé');

    const isValid = await bcrypt.compare(oldPass, user.password);
    if (!isValid)
      throw new UnauthorizedException('Ancien mot de passe incorrect');

    const hashed = await bcrypt.hash(newPass, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return { success: true, message: 'Mot de passe mis à jour avec succès.' };
  }

  async deleteUser(userId: number) {
    await this.prisma.user.delete({ where: { id: userId } });
    return {
      success: true,
      message: 'Compte et données supprimés définitivement.',
    };
  }
}

/**
 * Documentation du fichier
 *
 * - Role : Service central d'authentification. Il gere inscription, connexion, generation de JWT, changement de mot de passe et suppression de compte.
 * - Fonctionnement : Il hashe les mots de passe avec bcrypt, compare les credentials et refuse les comptes suspendus.
 * - A retenir : Le JWT contient les informations essentielles du user : id, email, role, prenom et nom.
 */
