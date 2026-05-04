import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';

describe('StatsService', () => {
  let service: StatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsService],
    }).compile();

    service = module.get<StatsService>(StatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

/**
 * Documentation du fichier
 *
 * - Role : Test minimal du service statistiques. Il verifie que StatsService est defini.
 * - Fonctionnement : Il peut etre complete avec des mocks Prisma pour tester les filtres de dates et categories.
 * - A retenir : Les calculs de tableau de bord meritent des tests car ils alimentent l'administration.
 */
