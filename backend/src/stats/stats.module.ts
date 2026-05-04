import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth.module';

@Module({
  imports: [AuthModule],
  controllers: [StatsController],
  providers: [StatsService, PrismaService],
})
export class StatsModule { }

/**
 * Documentation du fichier
 *
 * - Role : Module statistiques. Il regroupe StatsController, StatsService et PrismaService.
 * - Fonctionnement : Il active les routes admin/stats pour le tableau de bord et l'export.
 * - A retenir : Il est importe dans AppModule pour rendre les statistiques disponibles.
 */
