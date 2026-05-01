"use client";

import { useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";

import PublicResourcesList from "./PublicResourcesList.tsx";
import MyResourcesManager from "./MyResourcesManager";

export default function ResourcesPage() {
    const { data: session, status } = useSession();
    const [selectedTab, setSelectedTab] = useState("catalogue");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [availableCategories, setAvailableCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await fetch("http://localhost:3001/category");
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
            {/* BANDEAU BLEU */}
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

            {/* NAVIGATION ET FILTRES */}
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
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4">
                        <Input
                            value={search}
                            onValueChange={setSearch}
                            className="w-full lg:max-w-md"
                            placeholder="Rechercher..."
                            startContent={<Search size={20} className="text-gray-400" />}
                            variant="bordered"
                        />
                        <div className="flex flex-grow gap-3">
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-10 text-sm outline-none"
                            >
                                <option value="">Toutes les catégories</option>
                                {availableCategories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                            <select 
                                value={type} 
                                onChange={(e) => setType(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-10 text-sm outline-none"
                            >
                                <option value="">Tous les types</option>
                                <option value="ARTICLE">Article</option>
                                <option value="VIDEO">Vidéo</option>
                            </select>
                        </div>
                        <Button variant="flat" onPress={() => {setSearch(""); setCategory(""); setType("");}}>
                            Réinitialiser
                        </Button>
                    </div>
                </section>
            </div>

            {/* CONTENU - C'EST ICI QUE L'ALIGNEMENT SE JOUE */}
            <main className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-12">
                <div className="flex flex-col items-start justify-start w-full text-left">
                    {selectedTab === "catalogue" && (
                        <PublicResourcesList search={search} category={category} type={type} />
                    )}
                    {selectedTab === "mes-ressources" && status === "authenticated" && (
                        <MyResourcesManager token={(session as any)?.accessToken} search={search} category={category} type={type} />
                    )}
                </div>
            </main>
        </div>
    );
}