"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function FavoriteResourcesList({ token }: { token: string }) {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await fetch("http://localhost:3001/ressource/favorites", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (Array.isArray(data)) setFavorites(data);
            } catch (error) {
                console.error("Erreur favoris:", error);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchFavorites();
    }, [token]);

    if (loading) return <div className="flex justify-center p-10"><Spinner /></div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {favorites.length === 0 ? (
                <div className="col-span-full bg-white p-8 rounded-2xl border border-dashed text-center text-gray-500">
                    Vous n'avez pas encore de favoris.
                </div>
            ) : (
                favorites.map((fav) => (
                    <Link href={`/ressources/${fav.ressource.id}`} key={fav.id}>
                        <Card isPressable className="w-full border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <CardBody className="p-4 flex flex-row items-center gap-4">
                                <div className="p-2 bg-red-50 rounded-lg text-red-500">
                                    <Heart size={20} fill="currentColor" />
                                </div>
                                <div className="flex flex-col gap-1 text-left">
                                    <h4 className="font-bold text-[#1B365D] line-clamp-1">{fav.ressource.title}</h4>
                                    <div className="flex gap-2">
                                        <Chip size="sm" variant="flat" color="primary">{fav.ressource.type}</Chip>
                                        <span className="text-xs text-gray-400 self-center">
                                            Par {fav.ressource.author.firstName}
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Link>
                ))
            )}
        </div>
    );
}