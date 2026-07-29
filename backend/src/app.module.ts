import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
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
  imports: [
    // Limitation de debit (anti brute-force / abus) : 100 requetes / 60s / IP par defaut.
    // Des limites plus strictes sont appliquees sur les routes sensibles (voir auth.controller).
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    AuthModule,
    RessourceModule,
    UserModule,
    CategoryModule,
    CommentModule,
    StatsModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Applique la limitation de debit globalement a toutes les routes.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule { }

/**
 * Documentation du fichier
 *
 * - Role : Module racine NestJS. Il declare tous les modules fonctionnels de l'API.
 * - Fonctionnement : Il connecte auth, ressources, utilisateurs, categories, commentaires, statistiques et messages dans une seule application.
 * - A retenir : Toute nouvelle fonctionnalite backend majeure doit generalement etre importee ici via son module.
 */
