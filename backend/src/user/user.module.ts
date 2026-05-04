import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AdminUserController } from './admin-user.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController, AdminUserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule { }

/**
 * Documentation du fichier
 *
 * - Role : Module utilisateur. Il regroupe le controleur public, le controleur admin, le service et PrismaService.
 * - Fonctionnement : Il rend le domaine utilisateur disponible dans l'application Nest.
 * - A retenir : Les routes admin/users dependent de ce module.
 */
