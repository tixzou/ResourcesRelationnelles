import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Le nom de la catégorie', example: 'Santé Mentale' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom de la catégorie ne peut pas être vide' })
  name!: string; 
}