import { Controller, Get, Patch, Delete, Put, Param, Body, UseGuards } from '@nestjs/common';
import { RessourceService } from '../ressource/ressource.service'; // Vérifie que ce chemin est le bon chez toi
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

    // 1. Récupère TOUTES les ressources (le frontend se chargera de séparer Validées / En attente)
    @Get()
    @ApiOperation({ summary: 'Lister TOUTES les ressources (Admin)' })
    getAllRessources() {
        return this.ressourceService.findAllAdmin();
    }

    // 2. Approuver une ressource
    @Patch(':id/validate')
    @ApiOperation({ summary: 'Valider et publier une ressource' })
    validateRessource(@Param('id') id: string) {
        return this.ressourceService.validate(+id);
    }

    // 3. Suspendre une ressource déjà publiée
    @Patch(':id/suspend')
    @ApiOperation({ summary: 'Suspendre une ressource (retirer du catalogue)' })
    suspendRessource(@Param('id') id: string) {
        return this.ressourceService.suspend(+id);
    }

    // 4. L'admin édite n'importe quelle ressource
    @Put(':id')
    @ApiOperation({ summary: 'Éditer n’importe quelle ressource' })
    updateRessource(@Param('id') id: string, @Body() updateData: any) {
        return this.ressourceService.updateByAdmin(+id, updateData);
    }

    // 5. Rejeter ou Supprimer définitivement
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer définitivement une ressource' })
    deleteRessource(@Param('id') id: string) {
        return this.ressourceService.removeByAdmin(+id);
    }
}