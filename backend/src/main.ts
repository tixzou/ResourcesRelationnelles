import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app-setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration commune (securite, CORS, validation, Swagger).
  configureApp(app);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

/**
 * Documentation du fichier
 *
 * - Role : Point d'entree du backend en execution locale / serveur classique.
 * - Fonctionnement : Il cree l'application Nest, applique la configuration commune
 *   (voir app-setup.ts) puis ecoute sur la variable PORT ou sur 3001 par defaut.
 * - A retenir : La configuration est partagee avec l'entree serverless Vercel (api/index.ts)
 *   afin de garantir un comportement identique en local et en production.
 */
