import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

/**
 * Documentation du fichier
 *
 * - Role : Test unitaire du controleur racine. Il cree un module de test avec AppController et AppService.
 * - Fonctionnement : Il verifie que la route racine renvoie la chaine attendue.
 * - A retenir : C'est un test de squelette NestJS utile comme exemple minimal.
 */
