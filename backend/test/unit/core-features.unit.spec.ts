import { UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../../src/auth.service';
import { CategoryService } from '../../src/category/category.service';
import { CommentService } from '../../src/comment/comment.service';
import { RessourceService } from '../../src/ressource/ressource.service';
import { StatsService } from '../../src/stats/stats.service';

describe('Unit tests - fonctionnalites principales', () => {
  describe('1. Catalogue de ressources', () => {
    // Test unitaire: on verifie la logique du service sans appeler la vraie base.
    it('demande uniquement les ressources publiques et validees', async () => {
      const prisma = {
        ressource: { findMany: jest.fn().mockResolvedValue([]) },
      };
      const service = new RessourceService(prisma as any);

      await service.findAll();

      expect(prisma.ressource.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isPublic: true, isValidated: true },
        }),
      );
    });
  });

  describe('2. Authentification', () => {
    // Test unitaire: on teste AuthService avec Prisma et JWT remplaces par des mocks.
    it('connecte un utilisateur actif avec un mot de passe valide', async () => {
      const password = await bcrypt.hash('secret', 10);
      const prisma = {
        user: {
          findUnique: jest.fn().mockResolvedValue({
            id: 1,
            email: 'user@test.fr',
            password,
            role: Role.CITOYEN,
            firstName: 'Ada',
            lastName: 'Lovelace',
            isActive: true,
          }),
        },
      };
      const jwt = { signAsync: jest.fn().mockResolvedValue('jwt-token') };
      const service = new AuthService(prisma as any, jwt as any);

      const result = await service.login('user@test.fr', 'secret');

      expect(result.access_token).toBe('jwt-token');
      expect(result.user.email).toBe('user@test.fr');
    });

    // Test unitaire: un mot de passe invalide doit bloquer la connexion.
    it('refuse un mauvais mot de passe', async () => {
      const password = await bcrypt.hash('secret', 10);
      const prisma = {
        user: {
          findUnique: jest.fn().mockResolvedValue({
            password,
            isActive: true,
          }),
        },
      };
      const service = new AuthService(prisma as any, { signAsync: jest.fn() } as any);

      await expect(service.login('user@test.fr', 'bad-password')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('3. Creation de ressources', () => {
    // Test unitaire: la ressource doit etre rattachee a l'utilisateur connecte.
    it("associe la ressource a l'auteur connecte", async () => {
      const prisma = {
        ressource: { create: jest.fn().mockResolvedValue({ id: 10 }) },
      };
      const service = new RessourceService(prisma as any);

      await service.create({ title: 'Titre', content: 'Texte', type: 'Article', categoryId: 3 }, 42);

      expect(prisma.ressource.create).toHaveBeenCalledWith({
        data: {
          title: 'Titre',
          content: 'Texte',
          type: 'Article',
          authorId: 42,
          categoryId: 3,
        },
      });
    });
  });

  describe('4. Commentaires', () => {
    // Test unitaire: le service doit transmettre auteur, ressource et contenu a Prisma.
    it('cree un commentaire rattache a une ressource et a un auteur', async () => {
      const prisma = {
        comment: { create: jest.fn().mockResolvedValue({ id: 5 }) },
      };
      const service = new CommentService(prisma as any);

      await service.create({ content: 'Merci', ressourceId: 7, authorId: 2 });

      expect(prisma.comment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { content: 'Merci', ressourceId: 7, authorId: 2, parentId: null },
        }),
      );
    });
  });

  describe('5. Favoris et sauvegardes', () => {
    // Test unitaire: toggleFavorite ajoute un favori s'il n'existe pas encore.
    it('ajoute un favori quand il n existe pas encore', async () => {
      const prisma = {
        favorite: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({ id: 1 }),
          delete: jest.fn(),
        },
      };
      const service = new RessourceService(prisma as any);

      await service.toggleFavorite(8, 4);

      expect(prisma.favorite.create).toHaveBeenCalledWith({
        data: { userId: 4, ressourceId: 8 },
      });
      expect(prisma.favorite.delete).not.toHaveBeenCalled();
    });
  });

  describe('6. Administration', () => {
    // Test unitaire: la moderation publie une ressource en passant isValidated a true.
    it('valide une ressource pour la publier', async () => {
      const prisma = {
        ressource: { update: jest.fn().mockResolvedValue({ id: 9, isValidated: true }) },
      };
      const service = new RessourceService(prisma as any);

      await service.validate(9);

      expect(prisma.ressource.update).toHaveBeenCalledWith({
        where: { id: 9 },
        data: { isValidated: true },
      });
    });

    // Test unitaire: la gestion admin des categories passe par CategoryService.
    it('cree une categorie administrable', async () => {
      const prisma = {
        category: { create: jest.fn().mockResolvedValue({ id: 1, name: 'Famille' }) },
      };
      const service = new CategoryService(prisma as any);

      await service.create({ name: 'Famille' });

      expect(prisma.category.create).toHaveBeenCalledWith({ data: { name: 'Famille' } });
    });
  });

  describe('7. Statistiques', () => {
    // Test unitaire: StatsService agrege les compteurs renvoyes par Prisma.
    it('calcule les compteurs du tableau de bord', async () => {
      const prisma = {
        ressource: { count: jest.fn().mockResolvedValue(2) },
        favorite: { count: jest.fn().mockResolvedValue(3) },
        viewLog: { count: jest.fn().mockResolvedValue(4) },
        connectionLog: { count: jest.fn().mockResolvedValue(5) },
        comment: { count: jest.fn().mockResolvedValue(6) },
      };
      const service = new StatsService(prisma as any);

      const result = await service.getDashboardData({});

      expect(result).toEqual({
        creations: 2,
        exploitations: 3,
        consultations: 4,
        connexions: 5,
        commentaires: 6,
      });
    });
  });
});
