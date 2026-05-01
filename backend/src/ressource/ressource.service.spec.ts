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
