import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';

describe('CommentController', () => {
  let controller: CommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

/**
 * Documentation du fichier
 *
 * - Role : Test minimal du controleur commentaires. Il verifie que le controleur peut etre cree.
 * - Fonctionnement : Il sert de point de depart pour ajouter des tests de creation et suppression.
 * - A retenir : Il ne mocke pas encore les cas d'autorisation complexes.
 */
