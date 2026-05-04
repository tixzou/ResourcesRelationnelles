"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { addToast } from "@heroui/toast";

export default function FavoriteResourcesList({ token }: { token: string }) {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:3001/ressource/favorites/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFavorites(data);
            }
        } catch (error) {
            console.error("Erreur chargement favoris:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchFavorites();
    }, [token]);

    const handleRemoveFavorite = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:3001/ressource/${id}/favorite`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {

                setFavorites(prev => prev.filter(r => r.id !== id));
                addToast({ title: "Retiré des favoris", color: "default", variant: "flat" });
            }
        } catch (error) {
            addToast({ title: "Erreur", color: "danger" });
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;

    if (favorites.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center text-gray-500">
                Vous n'avez pas encore de ressources en favoris.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full text-left">
            {favorites.map(r => (
                <Card key={r.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardBody className="flex flex-row justify-between items-center p-5 gap-4">
                        <div className="flex flex-col gap-2">
                            <h3 className="font-bold text-lg text-[#1B365D] leading-tight">{r.title}</h3>
                            <div className="flex flex-wrap items-center gap-2">
                                <Chip size="sm" variant="flat" color="primary">{r.type}</Chip>
                                {r.category && <Chip size="sm" color="secondary" variant="flat">{r.category.name}</Chip>}
                                <span className="text-xs text-gray-400 font-medium ml-2">
                                    Par {r.author?.firstName} {r.author?.lastName}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                isIconOnly
                                variant="light"
                                color="danger"
                                onPress={() => handleRemoveFavorite(r.id)}
                                title="Retirer des favoris"
                            >
                                <Heart size={20} className="fill-current" />
                            </Button>
                            <Button
                                as={Link}
                                href={`/ressources/${r.id}`}
                                color="primary"
                                variant="flat"
                                endContent={<ArrowRight size={16} />}
                                className="font-medium"
                            >
                                Lire
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}

/**
 * Documentation du fichier
 *
 * - Role : Liste des favoris de l'utilisateur connecte. Elle charge /ressource/favorites/me avec le token.
 * - Fonctionnement : Elle affiche les ressources favorites et permet de retirer un favori en appelant /ressource/:id/favorite.
 * - A retenir : Elle garde l'etat local synchronise en retirant immediatement la carte apres succes.
 */
