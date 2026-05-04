import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide.' })
  @IsNotEmpty({ message: "L'email est requis." })
  email: string;

  @IsString()
  @MinLength(6, {
    message: 'Le mot de passe doit faire au moins 6 caractères.',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Le prénom est requis.' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis.' })
  lastName: string;
}

export class LoginDto {
  @ApiProperty({ example: 'cesi@exemple.com' })
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide.' })
  @IsNotEmpty({ message: "L'email est requis." })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis.' })
  password: string;
}

/**
 * Documentation du fichier
 *
 * - Role : DTO d'authentification. Il definit les donnees attendues pour l'inscription et la connexion.
 * - Fonctionnement : Les decorateurs class-validator imposent un email valide, des champs obligatoires et une longueur minimale de mot de passe.
 * - A retenir : Ces DTO ameliorent la validation d'entree et la documentation Swagger.
 */
