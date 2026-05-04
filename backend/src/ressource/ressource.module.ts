import { Module } from '@nestjs/common';
import { RessourceService } from './ressource.service';
import { RessourceController } from './ressource.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth.module';
import { AdminRessourceController } from './admin-ressource.controller';

@Module({
  imports: [AuthModule],
  controllers: [RessourceController, AdminRessourceController],
  providers: [RessourceService, PrismaService],
})
export class RessourceModule { }

/**
 * Documentation du fichier
 *
 * - Role : Module ressources. Il declare le controleur public, le controleur admin, le service et PrismaService.
 * - Fonctionnement : Il active les routes /ressource et /admin/ressources.
 * - A retenir : Il est l'un des modules metier majeurs de l'API.
 */
