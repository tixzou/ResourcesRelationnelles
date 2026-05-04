import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StatsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardData(filters: { start?: Date; end?: Date; categoryId?: number }) {

        let endOfDay = filters.end;
        if (endOfDay) {
            endOfDay = new Date(endOfDay);
            endOfDay.setHours(23, 59, 59, 999);
        }

        const dateFilter = (filters.start || endOfDay) ? {
            ...(filters.start && { gte: filters.start }),
            ...(endOfDay && { lte: endOfDay }),
        } : undefined;

        const [creations, exploitations, consultations, connexions, commentaires] = await Promise.all([

            this.prisma.ressource.count({
                where: {
                    ...(dateFilter && { createdAt: dateFilter }),
                    ...(filters.categoryId && { categoryId: filters.categoryId }),
                },
            }),

            this.prisma.favorite.count({
                where: {
                    ...(dateFilter && { createdAt: dateFilter }),
                    ...(filters.categoryId && { ressource: { categoryId: filters.categoryId } }),
                },
            }),

            this.prisma.viewLog.count({
                where: {
                    ...(dateFilter && { createdAt: dateFilter }),
                    ...(filters.categoryId && { ressource: { categoryId: filters.categoryId } }),
                },
            }),

            this.prisma.connectionLog.count({
                where: {
                    ...(dateFilter && { createdAt: dateFilter }),
                },
            }),

            this.prisma.comment.count({
                where: {
                    ...(dateFilter && { createdAt: dateFilter }),
                    ...(filters.categoryId && { ressource: { categoryId: filters.categoryId } }),
                },
            })
        ]);

        return { creations, exploitations, consultations, connexions, commentaires };
    }

    async getExportData() {
        const data = await this.prisma.ressource.findMany({
            include: {
                category: true,
                _count: {
                    select: {
                        viewLogs: true,
                        favoritedBy: true,
                        comments: true
                    }
                }
            }
        });

        return data.map(r => ({
            Titre: r.title,
            Type: r.type,
            Categorie: r.category?.name || 'Sans catégorie',
            Consultations: r._count.viewLogs,
            Exploitations: r._count.favoritedBy,
            Commentaires: r._count.comments,
            Date_Creation: r.createdAt.toLocaleDateString(),
            Status: r.isValidated ? 'Validée' : 'En attente'
        }));
    }
}

/**
 * Documentation du fichier
 *
 * - Role : Service des statistiques admin. Il compte les creations, exploitations, consultations, connexions et commentaires.
 * - Fonctionnement : Il applique les filtres de date et de categorie, avec une date de fin etendue jusqu'a la fin de journee.
 * - A retenir : Il prepare aussi des donnees exportables par ressource avec categorie, compteurs et statut.
 */
