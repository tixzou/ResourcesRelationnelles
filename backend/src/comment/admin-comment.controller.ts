import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '../auth.guard';
import { RolesGuard } from '../roles/guard';
import { Roles } from '../roles/decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('admin/comments (Modération)')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.MODERATEUR, Role.ADMINISTRATEUR)
@Controller('admin/comments')
export class AdminCommentController {
    constructor(private readonly commentService: CommentService) { }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un commentaire (Modération)' })
    remove(@Param('id') id: string) {
        return this.commentService.removeByAdmin(+id);
    }
}

/**
 * Documentation du fichier
 *
 * - Role : Controleur de moderation des commentaires expose sur /admin/comments. Il protege l'acces avec AuthGuard et RolesGuard.
 * - Fonctionnement : Il autorise les moderateurs et administrateurs a supprimer des commentaires sans etre l'auteur.
 * - A retenir : Il utilise CommentService pour centraliser la suppression et la verification d'existence.
 */
