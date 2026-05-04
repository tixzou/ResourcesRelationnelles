import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateRoleDto {
    @ApiProperty({
        enum: Role,
        example: 'MODERATEUR',
        description: 'Le nouveau rôle à attribuer à l’utilisateur'
    })
    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;
}

/**
 * Documentation du fichier
 *
 * - Role : DTO utilise pour changer le role d'un utilisateur depuis l'administration.
 * - Fonctionnement : Il type le champ role avec l'enum Prisma Role afin d'eviter les valeurs libres.
 * - A retenir : Il est consomme par AdminUserController sur PATCH /admin/users/:id/role.
 */
