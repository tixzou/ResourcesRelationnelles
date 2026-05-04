import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

/**
 * Documentation du fichier
 *
 * - Role : Test minimal du service categories. Il confirme que CategoryService peut etre instancie.
 * - Fonctionnement : Il peut etre etendu avec des mocks Prisma pour tester create, update, remove et findAll.
 * - A retenir : Il ne teste pas encore les erreurs de base de donnees.
 */
