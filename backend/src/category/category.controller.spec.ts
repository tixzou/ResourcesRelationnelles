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
