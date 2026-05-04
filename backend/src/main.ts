import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('(RE)Sources Relationnelles API')
    .setDescription('Swagger (RE)Sources Relationnelles API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

/**
 * Documentation du fichier
 *
 * - Role : Point d'entree du backend. Il cree l'application Nest, active CORS et configure Swagger.
 * - Fonctionnement : La documentation Swagger est disponible sur /api avec support du Bearer token.
 * - A retenir : Le serveur ecoute sur la variable PORT ou sur 3001 par defaut.
 */
