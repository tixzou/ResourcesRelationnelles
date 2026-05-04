import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Documentation du fichier
 *
 * - Role : Decorateur Roles. Il stocke les roles autorises dans les metadata NestJS de la route ou du controleur.
 * - Fonctionnement : Il est ensuite lu par RolesGuard pour accepter ou refuser l'acces.
 * - A retenir : Il rend les restrictions de roles lisibles directement au-dessus des endpoints.
 */
