import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

/**
 * Documentation du fichier
 *
 * - Role : Test unitaire minimal du service utilisateur. Il instancie UserService avec un PrismaService mocke.
 * - Fonctionnement : Il verifie uniquement que le service est defini.
 * - A retenir : Il peut etre complete avec des tests de changement de role, suspension et suppression.
 */
