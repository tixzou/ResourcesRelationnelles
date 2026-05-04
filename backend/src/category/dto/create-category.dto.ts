import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Le nom de la catégorie', example: 'Santé Mentale' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom de la catégorie ne peut pas être vide' })
  name!: string;
}

/**
 * Documentation du fichier
 *
 * - Role : DTO de creation de categorie. Il structure le body attendu lors d'un POST /category.
 * - Fonctionnement : Il permet de valider le nom avant la creation Prisma.
 * - A retenir : Il est reserve aux routes admin protegees par roles.
 */
