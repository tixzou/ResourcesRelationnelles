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

/**
 * Documentation du fichier
 *
 * - Role : Module messages. Il declare MessageController, MessageService et PrismaService.
 * - Fonctionnement : Il active les endpoints de chat rattaches aux ressources ou activites.
 * - A retenir : Il separe la logique de messagerie du module ressources.
 */
