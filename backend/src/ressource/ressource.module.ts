import { Module } from '@nestjs/common';
import { RessourceService } from './ressource.service';
import { RessourceController } from './ressource.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth.module';
import { AdminRessourceController } from './admin-ressource.controller';

@Module({
  imports: [AuthModule],
  controllers: [RessourceController, AdminRessourceController],
  providers: [RessourceService, PrismaService],
})
export class RessourceModule { }