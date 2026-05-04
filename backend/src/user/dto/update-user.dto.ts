import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

/**
 * Documentation du fichier
 *
 * - Role : DTO de mise a jour utilisateur. Il sert de base a de futures routes de profil ou d'administration.
 * - Fonctionnement : Il peut etre etendu avec prenom, nom, email ou autres champs modifiables.
 * - A retenir : Les operations admin actuelles utilisent plutot UpdateRoleDto et UserService.
 */
