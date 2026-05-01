import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth.guard';
import { PrismaService } from '../prisma.service';
import { RessourceController } from './ressource.controller';
import { RessourceService } from './ressource.service';

describe('RessourceController', () => {
  let controller: RessourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RessourceController],
      providers: [
        RessourceService,
        { provide: PrismaService, useValue: {} },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RessourceController>(RessourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
