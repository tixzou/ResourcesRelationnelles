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