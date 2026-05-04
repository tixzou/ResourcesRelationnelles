import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) return true;
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.includes(user.role);
    }
}

/**
 * Documentation du fichier
 *
 * - Role : Guard de roles NestJS. Il lit les roles requis avec Reflector sur la route et le controleur.
 * - Fonctionnement : Il compare ces roles avec request.user.role, ajoute par AuthGuard.
 * - A retenir : Il doit etre utilise apres AuthGuard pour que l'utilisateur soit disponible dans la requete.
 */
