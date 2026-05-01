import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service'; // Ajoute cet import
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CommentController],
  providers: [CommentService, PrismaService], // Ajoute CommentService ici
})
export class CommentModule {}