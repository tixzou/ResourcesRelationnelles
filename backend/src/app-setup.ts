import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

/**
 * Configuration commune de l'application NestJS.
 *
 * Utilisee a la fois par :
 *   - src/main.ts        (execution locale / serveur classique)
 *   - api/index.ts       (execution serverless sur Vercel)
 * afin que les deux environnements appliquent EXACTEMENT la meme configuration.
 *
 * - Securite : helmet (en-tetes HTTP), CORS restreint a FRONTEND_ORIGIN.
 * - Validation : ValidationPipe global (transform) pour valider les DTO d'entree.
 * - Documentation : Swagger expose sur /api.
 */
export function configureApp(app: INestApplication): void {
  // En-tetes de securite HTTP (protection XSS, clickjacking, etc.)
  app.use(helmet());

  // CORS : on autorise uniquement l'origine (ou les origines) du frontend.
  // FRONTEND_ORIGIN peut contenir plusieurs origines separees par des virgules.
  // Valeur par defaut : le frontend local, pour ne rien casser en developpement.
  const origins = (process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({ origin: origins, credentials: true });

  // Validation des entrees : les DTO decores par class-validator sont verifies.
  // transform:true convertit le payload en instance de DTO.
  // (Pas de whitelist pour ne pas supprimer les champs des routes a body libre.)
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Documentation Swagger disponible sur /api
  const config = new DocumentBuilder()
    .setTitle('(RE)Sources Relationnelles API')
    .setDescription('Swagger (RE)Sources Relationnelles API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
