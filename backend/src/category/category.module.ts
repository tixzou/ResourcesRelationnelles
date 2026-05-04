import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService],
})
export class CategoryModule { }

/**
 * Documentation du fichier
 *
 * - Role : Module categories. Il regroupe CategoryController, CategoryService et PrismaService.
 * - Fonctionnement : Il active les routes publiques de liste et les routes admin de gestion des categories.
 * - A retenir : Il est importe par AppModule pour alimenter les filtres frontend et l'administration.
 */
