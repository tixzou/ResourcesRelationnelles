"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import Link from "next/link";
import { Heart } from "lucide-react";

type PublicResourcesListProps = {
  search: string;
  category: string;
};

export default function PublicResourcesList({ search, category }: PublicResourcesListProps) {
  const [ressources, setRessources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRessources = async () => {
      try {
        const res = await fetch("http://localhost:3001/ressource");
        const data = await res.json();
        if (res.ok && Array.isArray(data)) setRessources(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRessources();
  }, []);

  const filteredRessources = ressources.filter((r) => {
    const safeTitle = r.title?.toLowerCase() || "";
    const safeContent = r.content?.toLowerCase() || "";
    const searchLower = search.toLowerCase();

    const matchSearch = safeTitle.includes(searchLower) || safeContent.includes(searchLower);
    const matchCategory = category ? r.category?.name === category : true;

    return matchSearch && matchCategory;
  });

  if (loading) return <div className="flex justify-center p-10 w-full"><Spinner size="lg" color="primary" /></div>;

  return (
    <div className="w-full">
      {filteredRessources.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center text-gray-500 w-full">
          Aucune ressource publique ne correspond à votre recherche.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredRessources.map((r) => {

            const favoritesCount = r._count?.favoritedBy || r.favoritedBy?.length || 0;

            return (
              <Link href={`/ressources/${r.id}`} key={r.id} className="block group h-full">
                <Card
                  isPressable
                  className="w-full h-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white flex flex-col overflow-hidden"
                >
                  <CardHeader className="flex flex-col items-start px-6 pt-6 pb-2 w-full text-left">
                    <div className="h-[56px] w-full mb-1">
                      <h3 className="text-lg font-bold text-[#1B365D] group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                        {r.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Par <span className="font-semibold text-gray-700">{r.author.firstName} {r.author.lastName}</span>
                    </p>
                  </CardHeader>

                  <CardBody className="px-6 py-3 flex-grow w-full text-left">
                    <p className="line-clamp-3 text-sm text-gray-500 leading-relaxed">
                      {r.content || "Aucun contenu disponible pour cette ressource."}
                    </p>
                  </CardBody>

                  <CardFooter className="px-6 pb-6 pt-4 flex justify-between items-center w-full border-t border-gray-50/50">
                    <div className="flex flex-wrap items-center gap-2">
                      <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="font-medium text-[11px] rounded-md px-1"
                      >
                        {r.type}
                      </Chip>
                      {r.category && (
                        <Chip
                          size="sm"
                          variant="bordered"
                          color="secondary"
                          className="border-gray-200 text-gray-600 text-[11px] rounded-md px-1"
                          startContent={<span className="w-1.5 h-1.5 rounded-full bg-secondary ml-1" />}
                        >
                          {r.category.name}
                        </Chip>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-pink-500 transition-colors shrink-0 ml-2">
                      <Heart size={18} strokeWidth={2.5} />
                      <span className="text-sm font-semibold">{favoritesCount}</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Documentation du fichier
 *
 * - Role : Liste publique du catalogue. Elle charge les ressources validees depuis /ressource.
 * - Fonctionnement : Elle applique les filtres de recherche et categorie fournis par le parent.
 * - A retenir : Elle affiche les cartes de ressources avec informations auteur, categorie, type et lien vers le detail.
 */
