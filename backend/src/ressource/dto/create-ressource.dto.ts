import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateRessourceDto {
    @ApiProperty({ example: 'Comment améliorer ses relations' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Contenu détaillé de la ressource...', required: false })
    @IsString()
    @IsOptional()
    content?: string;

    @ApiProperty({ example: 'ARTICLE' })
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiProperty({ default: true, required: false })
    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;

    @ApiProperty({ example: 1, required: false })
    @IsInt()
    @IsOptional()
    categoryId?: number;
}

/**
 * Documentation du fichier
 *
 * - Role : DTO de creation de ressource. Il decrit les informations necessaires : titre, contenu, type et categorie.
 * - Fonctionnement : Il doit idealement valider les types autorises et les champs obligatoires.
 * - A retenir : Il sert de contrat entre le frontend de creation et l'API backend.
 */
