"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import Link from "next/link";

type PublicResourcesListProps = {
  search: string;
  category: string;
  type: string;
};

export default function PublicResourcesList({ search, category, type }: PublicResourcesListProps) {
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
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                        (r.content && r.content.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = category ? r.category?.name === category : true;
    const matchType = type ? r.type === type : true;
    
    return matchSearch && matchCategory && matchType;
  });

  if (loading) return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
  if (ressources.length === 0) return <p className="text-left text-gray-500">Aucune ressource publique disponible.</p>;

  return (
    // Grid avec gap généreux et alignement à gauche
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {filteredRessources.length === 0 ? (
        <p className="text-left text-gray-500 col-span-full italic">Aucune ressource ne correspond à votre recherche.</p>
      ) : (
        filteredRessources.map((r) => (
          <Link href={`/ressources/${r.id}`} key={r.id} className="block group h-full">
            <Card 
              isPressable
              className="w-full h-full border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white flex flex-col items-start text-left overflow-hidden"
            >
              <CardHeader className="flex flex-col items-start px-6 pt-6 pb-2 w-full text-left">
                {/* Hauteur fixe pour le titre pour aligner les cartes horizontalement */}
                <div className="h-[60px] overflow-hidden w-full">
                  <h3 className="text-lg font-bold text-[#1B365D] group-hover:text-blue-600 transition-colors leading-tight line-clamp-2 text-left">
                    {r.title}
                  </h3>
                </div>
                <p className="text-xs text-default-400 mt-1 text-left">
                  Par <span className="font-medium text-gray-600">{r.author.firstName} {r.author.lastName}</span>
                </p>
              </CardHeader>

              <CardBody className="px-6 py-2 flex-grow w-full text-left">
                <p className="line-clamp-4 text-sm text-gray-500 leading-relaxed text-left">
                  {r.content || "Aucun contenu disponible pour cette ressource."}
                </p>
              </CardBody>

              <CardFooter className="px-6 pb-6 pt-4 flex justify-start gap-2 w-full">
                <Chip 
                  size="sm" 
                  variant="flat" 
                  className="bg-blue-50 text-blue-700 font-bold uppercase text-[10px] rounded-md px-2"
                >
                  {r.type}
                </Chip>
                {r.category && (
                  <Chip 
                    size="sm" 
                    variant="bordered" 
                    className="border-gray-200 text-gray-500 text-[10px] rounded-md px-2"
                    startContent={<span className="w-1.5 h-1.5 rounded-full bg-gray-400 ml-1" />}
                  >
                    {r.category.name}
                  </Chip>
                )}
              </CardFooter>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}