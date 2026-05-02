import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth.guard';
import { RolesGuard } from '../roles/guard';
import { Roles } from '../roles/decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('admin/users')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMINISTRATEUR) // 👈 Seul l'admin a accès à tout ce contrôleur
@Controller('admin/users')
export class AdminUserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    getAll() {
        return this.userService.findAllAdmin();
    }

    @Patch(':id/role')
    @ApiOperation({ summary: 'Changer le rôle d’un utilisateur' })
    updateRole(
        @Param('id') id: string,
        @Body() updateRoleDto: UpdateRoleDto
    ) {
        return this.userService.updateRole(+id, updateRoleDto.role);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.userService.remove(+id);
    }
}