import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

/**
 * Documentation du fichier
 *
 * - Role : DTO de modification de categorie. Il decrit les champs acceptes lors d'un PATCH /category/:id.
 * - Fonctionnement : Il est utilise par CategoryController avant d'appeler CategoryService.
 * - A retenir : Il peut contenir des validations pour proteger les donnees d'entree.
 */
