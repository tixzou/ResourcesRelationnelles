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

@Module({
  imports: [AuthModule, RessourceModule, UserModule, CategoryModule, CommentModule, StatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
