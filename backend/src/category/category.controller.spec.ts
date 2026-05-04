import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth.guard';
import { RolesGuard } from '../roles/guard';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

/**
 * Documentation du fichier
 *
 * - Role : Test minimal du controleur categories. Il verifie que CategoryController est instancie.
 * - Fonctionnement : Il peut etre complete avec des tests de droits admin et de liste publique.
 * - A retenir : Il sert surtout de squelette de test actuellement.
 */
