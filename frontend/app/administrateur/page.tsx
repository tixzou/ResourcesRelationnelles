"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import AdminRessourcesManager from "@/components/admin/AdminRessourcesManager";
import AdminUsersManager from "@/components/admin/AdminUsersManager";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState("ressources");

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
    }

    const role = (session?.user as any)?.role;
    const currentUserId = Number((session?.user as any)?.id);

    if (!session || (role !== "ADMINISTRATEUR" && role !== "MODERATEUR" && role !== "SUPER_ADMINISTRATEUR")) {
        router.push("/");
        return null;
    }

    // On crée une petite variable pour savoir si c'est un Admin ou Super Admin
    const isAdmin = role === "ADMINISTRATEUR" || role === "SUPER_ADMINISTRATEUR";

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <section className="bg-white border-b border-gray-200 py-8 px-6 sm:px-12 lg:px-24 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1B365D]">Tableau de Bord Administration</h1>
                        <p className="text-gray-500 mt-1">Gérez la plateforme, les utilisateurs et analysez les statistiques.</p>
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm">
                        Rôle : {role}
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-8">
                <Tabs
                    aria-label="Menu Administration"
                    selectedKey={selectedTab}
                    onSelectionChange={(key) => setSelectedTab(key as string)}
                    color="primary"
                    variant="solid"
                    classNames={{
                        tabList: "gap-2 p-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto",
                        cursor: "w-full bg-[#1B365D] rounded-lg",
                        tab: "px-6 h-10 rounded-lg",
                        tabContent: "group-data-[selected=true]:text-white font-medium text-sm"
                    }}
                >
                    {/* ONGLET 1 : Toujours visible (Admin + Modérateur) */}
                    <Tab key="ressources" title="Ressources & Catégories">
                        <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Gestion du catalogue</h2>
                            <p className="text-gray-500 mb-6">Consultez, validez, éditez vos ressources et organisez vos catégories.</p>
                            <AdminRessourcesManager token={(session as any)?.accessToken} role={role} />
                        </div>
                    </Tab>

                    {/* ONGLET 2 : Réservé aux Administrateurs */}
                    {isAdmin && (
                        <Tab key="users" title="Comptes Citoyens">
                            <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-2">Gestion des utilisateurs</h2>
                                <p className="text-gray-500 mb-6">Consultez la liste des citoyens inscrits et gérez l'activation ou les rôles des comptes.</p>
                                {/* On ajoute la prop role ici 👇 */}
                                <AdminUsersManager token={(session as any)?.accessToken} currentUserId={currentUserId} role={role} />
                            </div>
                        </Tab>
                    )}

                    {/* ONGLET 3 : Réservé aux Administrateurs */}
                    {isAdmin && (
                        <Tab key="stats" title="Statistiques & Exports">
                            <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Tableau de bord d'activité</h2>
                                <p className="text-gray-500">Ici viendra le dashboard avec des graphiques et les boutons d'export CSV/PDF.</p>
                            </div>
                        </Tab>
                    )}
                </Tabs>
            </main>
        </div>
    );
}