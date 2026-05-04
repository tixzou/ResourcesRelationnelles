import { Role } from '@prisma/client';
import { AuthController } from '../../src/auth.controller';
import { CategoryController } from '../../src/category/category.controller';
import { CommentController } from '../../src/comment/comment.controller';
import { RessourceController } from '../../src/ressource/ressource.controller';
import { AdminRessourceController } from '../../src/ressource/admin-ressource.controller';
import { StatsController } from '../../src/stats/stats.controller';
import { AdminUserController } from '../../src/user/admin-user.controller';

describe('Functional tests - controleurs principaux', () => {
  describe('1. Catalogue de ressources', () => {
    // Test fonctionnel: le controleur expose le comportement attendu de la route catalogue.
    it('expose la liste publique via le controleur ressource', async () => {
      const service = { findAll: jest.fn().mockResolvedValue([{ id: 1, title: 'Ecoute active' }]) };
      const controller = new RessourceController(service as any);

      await expect(controller.findAll()).resolves.toEqual([{ id: 1, title: 'Ecoute active' }]);
    });
  });

  describe('2. Authentification', () => {
    // Test fonctionnel: le controleur Auth transmet bien email/password au service.
    it('connecte via le controleur auth', async () => {
      const authService = { login: jest.fn().mockResolvedValue({ access_token: 'token' }) };
      const controller = new AuthController(authService as any);

      const result = await controller.login({ email: 'a@b.fr', password: 'secret' });

      expect(result).toEqual({ access_token: 'token' });
      expect(authService.login).toHaveBeenCalledWith('a@b.fr', 'secret');
    });
  });

  describe('3. Creation de ressources', () => {
    // Test fonctionnel: la route utilise l'id du JWT pour identifier l'auteur.
    it("cree une ressource avec l'id utilisateur du token", () => {
      const service = { create: jest.fn().mockReturnValue({ id: 11 }) };
      const controller = new RessourceController(service as any);

      const result = controller.create({ title: 'Atelier', type: 'Jeu' }, { user: { sub: 42 } });

      expect(result).toEqual({ id: 11 });
      expect(service.create).toHaveBeenCalledWith({ title: 'Atelier', type: 'Jeu' }, 42);
    });
  });

  describe('4. Commentaires', () => {
    // Test fonctionnel: la creation de commentaire recupere l'auteur depuis la requete.
    it("cree un commentaire avec l'auteur connecte", async () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
      const service = { create: jest.fn().mockResolvedValue({ id: 3 }) };
      const controller = new CommentController(service as any);

      await controller.create({ content: 'Bravo', ressourceId: 9 }, { user: { sub: 4 } });

      expect(service.create).toHaveBeenCalledWith({
        content: 'Bravo',
        ressourceId: 9,
        authorId: 4,
      });
      logSpy.mockRestore();
    });
  });

  describe('5. Favoris et sauvegardes', () => {
    // Test fonctionnel: la route favorite convertit les params HTTP avant d'appeler le service.
    it('bascule un favori depuis la route utilisateur', () => {
      const service = { toggleFavorite: jest.fn().mockReturnValue({ id: 1 }) };
      const controller = new RessourceController(service as any);

      controller.toggleFavorite('8', { user: { sub: 4 } });

      expect(service.toggleFavorite).toHaveBeenCalledWith(8, 4);
    });
  });

  describe('6. Administration', () => {
    // Test fonctionnel: le controleur admin appelle la validation de ressource.
    it('valide une ressource depuis le controleur admin', () => {
      const service = { validate: jest.fn().mockReturnValue({ id: 12, isValidated: true }) };
      const controller = new AdminRessourceController(service as any);

      controller.validateRessource('12');

      expect(service.validate).toHaveBeenCalledWith(12);
    });

    // Test fonctionnel: le controleur admin utilisateurs transmet role et id converti.
    it('change le role utilisateur depuis le controleur admin', () => {
      const service = { updateRole: jest.fn().mockReturnValue({ id: 2, role: Role.MODERATEUR }) };
      const controller = new AdminUserController(service as any);

      controller.updateRole('2', { role: Role.MODERATEUR });

      expect(service.updateRole).toHaveBeenCalledWith(2, Role.MODERATEUR);
    });

    // Test fonctionnel: le controleur categories envoie le DTO au service.
    it('cree une categorie depuis le controleur category', () => {
      const service = { create: jest.fn().mockReturnValue({ id: 1, name: 'Couple' }) };
      const controller = new CategoryController(service as any);

      controller.create({ name: 'Couple' });

      expect(service.create).toHaveBeenCalledWith({ name: 'Couple' });
    });
  });

  describe('7. Statistiques', () => {
    // Test fonctionnel: les query params string sont convertis avant la logique metier.
    it('convertit les filtres de query params avant appel service', async () => {
      const service = {
        getDashboardData: jest.fn().mockResolvedValue({ creations: 1 }),
      };
      const controller = new StatsController(service as any);

      await controller.getStats('2026-05-01', '2026-05-04', '3');

      expect(service.getDashboardData).toHaveBeenCalledWith({
        start: new Date('2026-05-01'),
        end: new Date('2026-05-04'),
        categoryId: 3,
      });
    });
  });
});
