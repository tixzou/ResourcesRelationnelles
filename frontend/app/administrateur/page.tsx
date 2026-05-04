"use client";

import { useState, useEffect } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import AdminRessourcesManager from "@/components/admin/AdminRessourcesManager";
import AdminUsersManager from "@/components/admin/AdminUsersManager";
import AdminStatsManager from "@/components/admin/AdminStatsManager";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState("ressources");

    const role = (session?.user as any)?.role;
    const currentUserId = Number((session?.user as any)?.id);

    useEffect(() => {
        if (status === "unauthenticated" || (status === "authenticated" && role !== "ADMINISTRATEUR" && role !== "MODERATEUR" && role !== "SUPER_ADMINISTRATEUR")) {
            router.push("/");
        }
    }, [status, role, router]);

    if (status === "loading" || status === "unauthenticated" || (role !== "ADMINISTRATEUR" && role !== "MODERATEUR" && role !== "SUPER_ADMINISTRATEUR")) {
        return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" color="primary" /></div>;
    }

    const isAdmin = role === "ADMINISTRATEUR" || role === "SUPER_ADMINISTRATEUR";

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <section className="bg-white border-b border-gray-200 py-6 sm:py-8 px-4 sm:px-12 lg:px-24 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="w-full md:w-auto">
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B365D]">Tableau de bord</h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-1">Gérez la plateforme, les utilisateurs et analysez les statistiques.</p>
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap">
                        Rôle : {role}
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-12 lg:px-24 py-6 sm:py-8">
                <Tabs
                    aria-label="Menu Administration"
                    selectedKey={selectedTab}
                    onSelectionChange={(key) => setSelectedTab(key as string)}
                    color="primary"
                    variant="solid"
                    classNames={{
                        tabList: "flex-wrap sm:flex-nowrap gap-2 p-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto",
                        cursor: "w-full bg-[#1B365D] rounded-lg",
                        tab: "px-3 sm:px-6 h-10 rounded-lg",
                        tabContent: "group-data-[selected=true]:text-white font-medium text-xs sm:text-sm"
                    }}
                >

                    <Tab key="ressources" title="Ressources & catégories">
                        <div className="mt-4 sm:mt-6 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Gestion du catalogue</h2>
                            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Consultez, validez, éditez vos ressources et organisez vos catégories.</p>
                            <AdminRessourcesManager token={(session as any)?.accessToken} role={role} />
                        </div>
                    </Tab>

                    {isAdmin && (
                        <Tab key="users" title="Gestion des comptes">
                            <div className="mt-4 sm:mt-6 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Gestion des utilisateurs</h2>
                                <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Consultez la liste des citoyens inscrits et gérez l'activation ou les rôles des comptes.</p>
                                <AdminUsersManager token={(session as any)?.accessToken} currentUserId={currentUserId} role={role} />
                            </div>
                        </Tab>
                    )}

                    {isAdmin && (
                        <Tab key="stats" title="Statistiques">
                            <div className="mt-4 sm:mt-6 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Tableau de bord d'activité</h2>
                                <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Suivez l'évolution de la plateforme et exportez vos données.</p>
                                <AdminStatsManager token={(session as any)?.accessToken} />
                            </div>
                        </Tab>
                    )}
                </Tabs>
            </main>
        </div>
    );
}

/**
 * Documentation du fichier
 *
 * - Role : Page client du tableau de bord administrateur. Elle lit la session NextAuth, controle le role de l'utilisateur et redirige vers l'accueil si l'acces est refuse.
 * - Fonctionnement : Elle organise l'administration en onglets. L'affichage est responsive grâce à l'utilisation de classes Tailwind (sm:, md:, lg:) et l'adaptation des paddings/tailles de texte.
 * - A retenir : Elle transmet le token JWT aux composants enfants afin qu'ils puissent appeler les routes protegees du backend.
 */