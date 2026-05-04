import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

/**
 * Documentation du fichier
 *
 * - Role : Service racine minimal. Il renvoie la chaine Hello World pour la route de base.
 * - Fonctionnement : Il est principalement conserve comme structure initiale NestJS.
 * - A retenir : Les services metier importants sont dans les dossiers auth, ressource, user, category, comment, message et stats.
 */
