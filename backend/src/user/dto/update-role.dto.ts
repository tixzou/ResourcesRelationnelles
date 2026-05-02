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