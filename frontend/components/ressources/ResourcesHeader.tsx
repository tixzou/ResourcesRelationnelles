"use client";
import { API_URL } from "@/config/api";

import { useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";

import PublicResourcesList from "./PublicResourcesList";
import MyResourcesManager from "./MyResourcesManager";

export default function ResourcesPage() {
    const { data: session, status } = useSession();
    const [selectedTab, setSelectedTab] = useState("catalogue");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [availableCategories, setAvailableCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await fetch(`${API_URL}/category`);
                const data = await res.json();
                if (Array.isArray(data)) setAvailableCategories(data);
            } catch (error) {
                console.error("Erreur catégories:", error);
            }
        };
        fetchCats();
    }, []);

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] text-left">

            <section className="bg-[#1B365D] w-full py-16 px-6 sm:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-white text-4xl sm:text-5xl font-bold mb-4">
                        {selectedTab === "catalogue" ? "Catalogue de ressources" : "Mes ressources"}
                    </h1>
                    <p className="text-blue-100/80 text-lg max-w-3xl">
                        Explorez notre bibliothèque complète de ressources.
                    </p>
                </div>
            </section>

            <div className="bg-white border-b border-gray-200">
                <section className="w-full px-6 sm:px-12 lg:px-24 pt-2">
                    <div className="max-w-7xl mx-auto">
                        <Tabs
                            selectedKey={selectedTab}
                            onSelectionChange={(key) => setSelectedTab(key as string)}
                            variant="underlined"
                            classNames={{
                                tabList: "gap-8 p-0",
                                cursor: "bg-[#1B365D]",
                                tabContent: "group-data-[selected=true]:text-[#1B365D] font-bold"
                            }}
                        >
                            <Tab key="catalogue" title="Catalogue public" />
                            {status === "authenticated" && <Tab key="mes-ressources" title="Espace personnel" />}
                        </Tabs>
                    </div>
                </section>

                <section className="w-full py-6 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
                        <Input
                            value={search}
                            onValueChange={setSearch}
                            className="w-full md:flex-1"
                            placeholder="Rechercher une ressource..."
                            startContent={<Search size={20} className="text-gray-400" />}
                            variant="bordered"
                        />
                        <div className="flex w-full md:w-auto gap-3">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="flex-1 md:w-64 bg-gray-50 border border-gray-200 rounded-xl px-4 h-10 text-sm outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                <option value="">Toutes les catégories</option>
                                {availableCategories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>

                            <Button
                                variant="flat"
                                className="h-10 px-6 font-medium"
                                onPress={() => {
                                    setSearch("");
                                    setCategory("");
                                }}
                            >
                                Réinitialiser
                            </Button>
                        </div>
                    </div>
                </section>
            </div>

            <main className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-12">
                <div className="flex flex-col items-start justify-start w-full text-left">
                    {selectedTab === "catalogue" && (
                        <PublicResourcesList search={search} category={category} />
                    )}
                    {selectedTab === "mes-ressources" && status === "authenticated" && (
                        <MyResourcesManager token={(session as any)?.accessToken} search={search} category={category} />
                    )}
                </div>
            </main>
        </div>
    );
}

/**
 * Documentation du fichier
 *
 * - Role : En-tete fonctionnel de la section ressources. Il gere la session, l'onglet actif, la recherche et le filtre categorie.
 * - Fonctionnement : Il charge les categories depuis /category pour alimenter le select.
 * - A retenir : Il affiche les vues catalogue, favoris et ressources personnelles selon l'etat de connexion.
 */
