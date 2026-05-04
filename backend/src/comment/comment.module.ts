import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth.module';
import { AdminCommentController } from './admin-comment.controller';

@Module({
  imports: [AuthModule],
  controllers: [CommentController, AdminCommentController],
  providers: [CommentService, PrismaService],
})
export class CommentModule { }

/**
 * Documentation du fichier
 *
 * - Role : Module commentaires. Il declare les controleurs commentaire et moderation, le service et PrismaService.
 * - Fonctionnement : Il isole les routes de discussion autour des ressources.
 * - A retenir : Il est importe par AppModule pour activer les endpoints /comment et /admin/comments.
 */
