import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

describe('MessageController', () => {
  let controller: MessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [MessageService],
    }).compile();

    controller = module.get<MessageController>(MessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

/**
 * Documentation du fichier
 *
 * - Role : Test minimal du controleur message. Il confirme l'instanciation du controleur.
 * - Fonctionnement : Il peut etre etendu pour tester les routes activity/:ressourceId.
 * - A retenir : Les cas de token manquant ou invalide seraient aussi importants.
 */
