import { PartialType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}

/**
 * Documentation du fichier
 *
 * - Role : DTO de mise a jour d'un message. Il est prevu pour une future route d'edition de message.
 * - Fonctionnement : Il sert a structurer les donnees d'entree si l'API ajoute un PATCH/PUT message.
 * - A retenir : A ce stade, les routes existantes ne l'utilisent pas encore fortement.
 */
