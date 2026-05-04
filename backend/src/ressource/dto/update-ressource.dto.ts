import { PartialType } from '@nestjs/mapped-types';
import { CreateRessourceDto } from './create-ressource.dto';

export class UpdateRessourceDto extends PartialType(CreateRessourceDto) {}

/**
 * Documentation du fichier
 *
 * - Role : DTO de modification de ressource. Il sert a typer les donnees envoyees lors d'une edition.
 * - Fonctionnement : Il peut etre derive du DTO de creation pour rendre les champs optionnels.
 * - A retenir : Il accompagne les routes d'edition utilisateur ou admin.
 */
