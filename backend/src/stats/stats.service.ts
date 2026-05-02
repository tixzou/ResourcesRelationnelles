import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StatsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardData(filters: { start?: Date; end?: Date; categoryId?: number }) {
        // On ne construit l'objet de date QUE si start ou end existent
        const dateFilter = (filters.start || filters.end) ? {
            ...(filters.start && { gte: filters.start }),
            ...(filters.end && { lte: filters.end }),
        } : undefined;

        const [creations, exploitations, consultations, connexions] = await Promise.all([
            // 1. Créations : Si categoryId est undefined, Prisma l'ignore
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

            // 4. Connexions (Indépendant des catégories de ressources)
            this.prisma.connectionLog.count({
                where: {
                    ...(dateFilter && { createdAt: dateFilter }),
                },
            }),
        ]);

        return { creations, exploitations, consultations, connexions };
    }

    async getExportData() {
        // On récupère toutes les ressources avec leurs relations et les comptes d'activité
        const data = await this.prisma.ressource.findMany({
            include: {
                category: true,
                _count: {
                    select: {
                        viewLogs: true,   // Consultations
                        favoritedBy: true // Exploitations
                    }
                }
            }
        });

        // On "aplatit" les données pour qu'elles soient lisibles dans un tableur
        return data.map(r => ({
            Titre: r.title,
            Type: r.type,
            Categorie: r.category?.name || 'Sans catégorie',
            Consultations: r._count.viewLogs,
            Exploitations: r._count.favoritedBy,
            Date_Creation: r.createdAt.toLocaleDateString(),
            Status: r.isValidated ? 'Validée' : 'En attente'
        }));
    }
}