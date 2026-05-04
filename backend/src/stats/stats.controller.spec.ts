import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';

describe('StatsController', () => {
  let controller: StatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
    }).compile();

    controller = module.get<StatsController>(StatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

/**
 * Documentation du fichier
 *
 * - Role : Test minimal du controleur statistiques. Il verifie que StatsController peut etre cree.
 * - Fonctionnement : Il peut etre enrichi avec des tests de parsing de query params et de roles.
 * - A retenir : Il ne valide pas encore le contenu des indicateurs.
 */
