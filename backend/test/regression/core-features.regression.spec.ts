import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../../src/auth.service';
import { CommentService } from '../../src/comment/comment.service';
import { RessourceService } from '../../src/ressource/ressource.service';
import { RolesGuard } from '../../src/roles/guard';
import { StatsService } from '../../src/stats/stats.service';

describe('Regression tests - regles metier a proteger', () => {
  describe('1. Catalogue de ressources', () => {
    // Test de non-regression: une ressource non validee/privee ne doit jamais ressortir.
    it('ne doit jamais lister les ressources privees ou non validees', async () => {
      const prisma = {
        ressource: { findMany: jest.fn().mockResolvedValue([]) },
      };
      const service = new RessourceService(prisma as any);

      await service.findAll();

      expect(prisma.ressource.findMany.mock.calls[0][0].where).toEqual({
        isPublic: true,
        isValidated: true,
      });
    });
  });

  describe('2. Authentification', () => {
    // Test de non-regression: un compte suspendu reste bloque meme avec le bon mot de passe.
    it('bloque toujours la connexion d un compte suspendu', async () => {
      const password = await bcrypt.hash('secret', 10);
      const prisma = {
        user: {
          findUnique: jest.fn().mockResolvedValue({
            password,
            isActive: false,
          }),
        },
      };
      const service = new AuthService(prisma as any, { signAsync: jest.fn() } as any);

      await expect(service.login('blocked@test.fr', 'secret')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('3. Creation de ressources', () => {
    // Test de non-regression: une contribution citoyenne attend toujours une validation admin.
    it('garde une nouvelle ressource non validee par defaut', async () => {
      const prisma = {
        ressource: { create: jest.fn().mockResolvedValue({ id: 1 }) },
      };
      const service = new RessourceService(prisma as any);

      await service.create({ title: 'Nouveau', type: 'Article' }, 5);

      // Prisma applique le defaut false du schema; le service ne doit pas forcer true.
      expect(prisma.ressource.create.mock.calls[0][0].data).not.toHaveProperty('isValidated', true);
    });
  });

  describe('4. Commentaires', () => {
    // Test de non-regression: un utilisateur ne peut supprimer que ses propres commentaires.
    it("empeche un utilisateur de supprimer le commentaire d'un autre", async () => {
      const prisma = {
        comment: {
          findUnique: jest.fn().mockResolvedValue({ id: 7, authorId: 1 }),
          delete: jest.fn(),
        },
      };
      const service = new CommentService(prisma as any);

      await expect(service.remove(7, 2)).rejects.toBeInstanceOf(ForbiddenException);
      expect(prisma.comment.delete).not.toHaveBeenCalled();
    });
  });

  describe('5. Favoris et sauvegardes', () => {
    // Test de non-regression: le toggle evite les doublons favori user/ressource.
    it('ne cree pas de doublon favori pour le meme utilisateur et la meme ressource', async () => {
      const prisma = {
        favorite: {
          findUnique: jest.fn().mockResolvedValue({ id: 10 }),
          create: jest.fn(),
          delete: jest.fn().mockResolvedValue({ id: 10 }),
        },
      };
      const service = new RessourceService(prisma as any);

      await service.toggleFavorite(3, 4);

      expect(prisma.favorite.delete).toHaveBeenCalledWith({ where: { id: 10 } });
      expect(prisma.favorite.create).not.toHaveBeenCalled();
    });
  });

  describe('6. Administration', () => {
    // Test de non-regression: les routes admin restent interdites aux citoyens.
    it('refuse un citoyen sur une route reservee admin/moderation', () => {
      const reflector = {
        getAllAndOverride: jest.fn().mockReturnValue([Role.ADMINISTRATEUR]),
      } as unknown as Reflector;
      const guard = new RolesGuard(reflector);
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: () => ({
          getRequest: () => ({ user: { role: Role.CITOYEN } }),
        }),
      } as unknown as ExecutionContext;

      expect(guard.canActivate(context)).toBe(false);
    });
  });

  describe('7. Statistiques', () => {
    // Test de non-regression: le filtre de date de fin couvre toute la journee.
    it('inclut toute la journee quand un filtre de fin est fourni', async () => {
      const prisma = {
        ressource: { count: jest.fn().mockResolvedValue(0) },
        favorite: { count: jest.fn().mockResolvedValue(0) },
        viewLog: { count: jest.fn().mockResolvedValue(0) },
        connectionLog: { count: jest.fn().mockResolvedValue(0) },
        comment: { count: jest.fn().mockResolvedValue(0) },
      };
      const service = new StatsService(prisma as any);

      await service.getDashboardData({ end: new Date('2026-05-04') });

      const createdAt = prisma.ressource.count.mock.calls[0][0].where.createdAt;
      expect(createdAt.lte.getHours()).toBe(23);
      expect(createdAt.lte.getMinutes()).toBe(59);
      expect(createdAt.lte.getSeconds()).toBe(59);
    });
  });
});
