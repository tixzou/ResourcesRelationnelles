import { Controller, Get, Patch, Delete, Put, Param, Body, UseGuards } from '@nestjs/common';
import { RessourceService } from '../ressource/ressource.service';
import { AuthGuard } from '../auth.guard';
import { RolesGuard } from '../roles/guard';
import { Roles } from '../roles/decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('admin/ressources (Modération)')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.MODERATEUR, Role.ADMINISTRATEUR, Role.SUPER_ADMINISTRATEUR)
@Controller('admin/ressources')
export class AdminRessourceController {
    constructor(private readonly ressourceService: RessourceService) { }

    @Get()
    @ApiOperation({ summary: 'Lister TOUTES les ressources (Admin)' })
    getAllRessources() {
        return this.ressourceService.findAllAdmin();
    }

    @Patch(':id/validate')
    @ApiOperation({ summary: 'Valider et publier une ressource' })
    validateRessource(@Param('id') id: string) {
        return this.ressourceService.validate(+id);
    }

    @Patch(':id/suspend')
    @ApiOperation({ summary: 'Suspendre une ressource (retirer du catalogue)' })
    suspendRessource(@Param('id') id: string) {
        return this.ressourceService.suspend(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Éditer n’importe quelle ressource' })
    updateRessource(@Param('id') id: string, @Body() updateData: any) {
        return this.ressourceService.updateByAdmin(+id, updateData);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer définitivement une ressource' })
    deleteRessource(@Param('id') id: string) {
        return this.ressourceService.removeByAdmin(+id);
    }
}

/**
 * Documentation du fichier
 *
 * - Role : Controleur de moderation des ressources expose sur /admin/ressources. Il est protege par AuthGuard, RolesGuard et roles moderation/admin.
 * - Fonctionnement : Il permet de lister toutes les ressources, valider, suspendre, modifier ou supprimer n'importe quelle ressource.
 * - A retenir : Il delegue toutes les operations au RessourceService afin de centraliser les acces Prisma.
 */
