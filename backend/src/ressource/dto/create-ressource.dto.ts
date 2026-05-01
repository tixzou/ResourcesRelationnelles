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