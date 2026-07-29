"use client";
import { API_URL } from "@/config/api";

import { useEffect, useState, useCallback } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";

import { Download, Eye, PlusCircle, Heart, FilterX, MessageSquare } from "lucide-react";
import { addToast } from "@heroui/toast";

export default function AdminStatsManager({ token }: { token: string }) {

    const [stats, setStats] = useState({ creations: 0, exploitations: 0, consultations: 0, commentaires: 0 });
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [categoryId, setCategoryId] = useState<Set<string>>(new Set([]));

    useEffect(() => {
        fetch(`${API_URL}/category`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setCategories(data); })
            .catch(() => console.error("Erreur chargement des catégories"));
    }, []);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (startDate) queryParams.append("start", startDate);
            if (endDate) queryParams.append("end", endDate);

            const selectedCat = Array.from(categoryId)[0];
            if (selectedCat) queryParams.append("categoryId", selectedCat as string);

            const res = await fetch(`${API_URL}/admin/stats?${queryParams.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setStats(data);
            } else {
                throw new Error("Erreur API");
            }
        } catch (error) {
            addToast({ title: "Erreur lors du chargement des statistiques", color: "danger" });
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, categoryId, token]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await fetch(`${API_URL}/admin/stats/export`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Erreur");

            const data = await res.json();
            if (!data || data.length === 0) {
                addToast({ title: "Aucune donnée à exporter", color: "warning" });
                return;
            }

            const headers = Object.keys(data[0]);
            const csvRows = data.map((row: any) =>
                headers.map(fieldName => JSON.stringify(row[fieldName] ?? "")).join(",")
            );

            const csvString = "\uFEFF" + [headers.join(";"), ...csvRows].join("\r\n").replace(/,/g, ";");

            const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `export_statistiques_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            addToast({ title: "Export réussi", color: "success" });
        } catch (error) {
            addToast({ title: "Échec de l'export", color: "danger" });
        } finally {
            setExporting(false);
        }
    };

    const handleResetFilters = () => {
        setStartDate("");
        setEndDate("");
        setCategoryId(new Set([]));
    };

    return (
        <div className="w-full flex flex-col gap-6">

            <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full xl:flex-1">
                    <Input
                        type="date"
                        label="Date de début"
                        variant="bordered"
                        size="sm"
                        value={startDate}
                        onValueChange={setStartDate}
                    />
                    <Input
                        type="date"
                        label="Date de fin"
                        variant="bordered"
                        size="sm"
                        value={endDate}
                        onValueChange={setEndDate}
                    />
                    <Select
                        label="Catégorie"
                        variant="bordered"
                        size="sm"
                        selectedKeys={categoryId}
                        onSelectionChange={(keys) => setCategoryId(keys as Set<string>)}
                    >
                        {categories.map((cat) => (
                            <SelectItem key={cat.id.toString()}>{cat.name}</SelectItem>
                        ))}
                    </Select>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto shrink-0 mt-1 xl:mt-0">
                    <Button
                        variant="flat"
                        color="default"
                        className="h-12 w-full sm:w-auto"
                        startContent={<FilterX size={18} />}
                        onPress={handleResetFilters}
                    >
                        Réinitialiser
                    </Button>
                    <Button
                        color="primary"
                        className="bg-[#1B365D] h-12 font-bold w-full sm:w-auto"
                        startContent={exporting ? <Spinner size="sm" color="white" /> : <Download size={18} />}
                        onPress={handleExport}
                        isDisabled={exporting}
                    >
                        Exporter (CSV)
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Spinner size="lg" color="primary" /></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

                    <Card className="border-none shadow-sm bg-blue-50/50">
                        <CardBody className="p-4 flex flex-row items-center gap-3 overflow-hidden">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0">
                                <Eye size={22} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">Vues</p>
                                <p className="text-xl sm:text-2xl font-bold text-[#1B365D] truncate">{stats.consultations}</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="border-none shadow-sm bg-emerald-50/50">
                        <CardBody className="p-4 flex flex-row items-center gap-3 overflow-hidden">
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
                                <PlusCircle size={22} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">Créations</p>
                                <p className="text-xl sm:text-2xl font-bold text-[#1B365D] truncate">{stats.creations}</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="border-none shadow-sm bg-rose-50/50">
                        <CardBody className="p-4 flex flex-row items-center gap-3 overflow-hidden">
                            <div className="p-3 bg-rose-100 text-rose-600 rounded-xl shrink-0">
                                <Heart size={22} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">Favoris</p>
                                <p className="text-xl sm:text-2xl font-bold text-[#1B365D] truncate">{stats.exploitations}</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="border-none shadow-sm bg-amber-50/50">
                        <CardBody className="p-4 flex flex-row items-center gap-3 overflow-hidden">
                            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl shrink-0">
                                <MessageSquare size={22} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">Commentaires</p>
                                <p className="text-xl sm:text-2xl font-bold text-[#1B365D] truncate">{stats.commentaires}</p>
                            </div>
                        </CardBody>
                    </Card>

                </div>
            )}
        </div>
    );
}

/**
 * Documentation du fichier
 *
 * - Role : Gestionnaire du tableau de bord statistiques. Il charge les categories, applique des filtres et appelle /admin/stats.
 * - Fonctionnement : Il affiche les compteurs principaux dans une grille 100% responsive adaptee a 4 cartes. 
 * - A retenir : Il propose un export des donnees au format CSV. La statistique de connexions a ete retiree.
 */