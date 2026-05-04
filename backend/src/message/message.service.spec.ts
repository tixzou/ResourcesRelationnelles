import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageService],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

/**
 * Documentation du fichier
 *
 * - Role : Test minimal du service message. Il verifie que MessageService existe avec un PrismaService mocke.
 * - Fonctionnement : Il peut etre complete avec des tests d'envoi et de tri chronologique.
 * - A retenir : Il ne verifie pas encore les relations sender/ressource.
 */
