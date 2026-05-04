import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [MessageController],
  providers: [MessageService, PrismaService, JwtService, ConfigService], 
})
export class MessageModule {}