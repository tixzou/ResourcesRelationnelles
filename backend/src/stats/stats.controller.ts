import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AuthGuard } from '../auth.guard';
import { RolesGuard } from '../roles/guard';
import { Roles } from '../roles/decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('admin/stats')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)

@Roles(Role.ADMINISTRATEUR, Role.SUPER_ADMINISTRATEUR)
@Controller('admin/stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get()
    @ApiQuery({ name: 'start', required: false, type: String, description: "Date de début (YYYY-MM-DD)" })
    @ApiQuery({ name: 'end', required: false, type: String, description: "Date de fin (YYYY-MM-DD)" })
    @ApiQuery({ name: 'categoryId', required: false, type: Number, description: "ID de la catégorie" })
    async getStats(
        @Query('start') start?: string,
        @Query('end') end?: string,
        @Query('categoryId') categoryId?: string,
    ) {
        return this.statsService.getDashboardData({
            start: start ? new Date(start) : undefined,
            end: end ? new Date(end) : undefined,
            categoryId: categoryId ? +categoryId : undefined,
        });
    }

    @Get('export')

    @Roles(Role.ADMINISTRATEUR, Role.SUPER_ADMINISTRATEUR)
    async exportStats() {
        return this.statsService.getExportData();
    }
}

/**
 * Documentation du fichier
 *
 * - Role : Controleur des statistiques admin expose sur /admin/stats. Il est protege par AuthGuard, RolesGuard et roles admin/super admin.
 * - Fonctionnement : Il lit les query params start, end et categoryId puis les convertit avant d'appeler StatsService.
 * - A retenir : Il expose aussi /admin/stats/export pour recuperer une vue exportable des ressources.
 */
