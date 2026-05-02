import { Controller, Get, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { RessourceService } from './ressource.service';
import { AuthGuard } from '../auth.guard';
import { RolesGuard } from '../roles/guard';
import { Roles } from '../roles/decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('admin/ressources (Modération)')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.MODERATEUR, Role.ADMINISTRATEUR)
@Controller('admin/ressources')
export class AdminRessourceController {
    constructor(private readonly ressourceService: RessourceService) { }

    @Get('pending')
    @ApiOperation({ summary: 'Lister les ressources en attente de validation' })
    getPendingRessources() {
        return this.ressourceService.findEnAttente();
    }

    @Patch(':id/validate')
    @ApiOperation({ summary: 'Valider et publier une ressource' })
    validateRessource(@Param('id') id: string) {
        return this.ressourceService.validate(+id);
    }

    @Delete(':id/reject')
    @ApiOperation({ summary: 'Rejeter (supprimer) une ressource non conforme' })
    rejectRessource(@Param('id') id: string) {
        return this.ressourceService.reject(+id);
    }
}