import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app-setup';

/**
 * Point d'entree SERVERLESS pour Vercel.
 *
 * Vercel n'execute pas un serveur permanent : il invoque une fonction a chaque requete.
 * On cree donc une instance Express, on y branche l'application NestJS une seule fois
 * (mise en cache via la promesse `ready`), puis on delegue chaque requete a Express.
 *
 * La configuration (securite, CORS, validation, Swagger) est la meme qu'en local
 * grace a configureApp(), importee depuis src/app-setup.ts.
 */
const server = express();
let ready: Promise<void> | null = null;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  configureApp(app);
  await app.init();
}

export default async function handler(req: Request, res: Response) {
  if (!ready) {
    ready = bootstrap();
  }
  await ready;
  server(req, res);
}
