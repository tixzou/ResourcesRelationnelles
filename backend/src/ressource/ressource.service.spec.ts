import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { RessourceService } from './ressource.service';

describe('RessourceService', () => {
  let service: RessourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RessourceService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<RessourceService>(RessourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

/**
 * Documentation du fichier
 *
 * - Role : Test minimal du service ressources. Il verifie que RessourceService peut etre instancie avec ses dependances.
 * - Fonctionnement : Il peut etre complete avec les cas importants : filtre public, droits auteur, favoris et moderation.
 * - A retenir : La logique de ce service est centrale et merite des tests plus pousses.
 */
