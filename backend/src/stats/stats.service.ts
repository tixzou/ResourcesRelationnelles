import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StatsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardData(filters: { start?: Date; end?: Date; categoryId?: number }) {
        // CORRECTION DATES : On pousse la date de fin à 23:59:59 pour inclure toute la journée
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
            // 1. Créations
            this.prisma.ressource.count({
                where: {
                    ...(dateFilter && { createdAt: dateFilter }),
                    ...(filters.categoryId && { categoryId: filters.categoryId }),
                },
            }),

            // 2. Exploitations (Favoris)
            this.prisma.favorite.count({
                where: {
                    ...(dateFilter && { createdAt: dateFilter }),
                    ...(filters.categoryId && { ressource: { categoryId: filters.categoryId } }),
                },
            }),

            // 3. Consultations
            this.prisma.viewLog.count({
                where: {
                    ...(dateFilter && { createdAt: dateFilter }),
                    ...(filters.categoryId && { ressource: { categoryId: filters.categoryId } }),
                },
            }),

            // 4. Connexions (sans filtre de catégorie car c'est global à l'app)
            this.prisma.connectionLog.count({
                where: {
                    ...(dateFilter && { createdAt: dateFilter }),
                },
            }),

            // 5. NOUVEAU : Commentaires
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
                        viewLogs: true,   // Consultations
                        favoritedBy: true, // Exploitations
                        comments: true     // 👈 NOUVEAU : Commentaires
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
            Commentaires: r._count.comments, // 👈 Ajouté au CSV
            Date_Creation: r.createdAt.toLocaleDateString(),
            Status: r.isValidated ? 'Validée' : 'En attente'
        }));
    }
}