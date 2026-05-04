import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

/**
 * Documentation du fichier
 *
 * - Role : Test end-to-end NestJS initial. Il demarre l'application dans un module de test complet.
 * - Fonctionnement : Il interroge la route racine et verifie la reponse HTTP attendue.
 * - A retenir : Il peut etre etendu pour tester les vrais flux API : auth, ressources, roles et commentaires.
 */
