import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {

    await this.$connect();
  }
}

/**
 * Documentation du fichier
 *
 * - Role : Service d'acces base de donnees. Il etend PrismaClient pour l'injecter proprement dans NestJS.
 * - Fonctionnement : La methode onModuleInit ouvre la connexion a la base au demarrage du module.
 * - A retenir : Tous les services metier utilisent cette classe pour executer leurs requetes Prisma.
 */
