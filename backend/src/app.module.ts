import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth.module';
import { RessourceModule } from './ressource/ressource.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { CommentController } from './comment/comment.controller';
import { CommentModule } from './comment/comment.module';
import { StatsModule } from './stats/stats.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [AuthModule, RessourceModule, UserModule, CategoryModule, CommentModule, StatsModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

/**
 * Documentation du fichier
 *
 * - Role : Module racine NestJS. Il declare tous les modules fonctionnels de l'API.
 * - Fonctionnement : Il connecte auth, ressources, utilisateurs, categories, commentaires, statistiques et messages dans une seule application.
 * - A retenir : Toute nouvelle fonctionnalite backend majeure doit generalement etre importee ici via son module.
 */
