"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
// 👈 Ajout de MessageSquare pour l'icône des commentaires
import { Download, Eye, PlusCircle, Heart, UserCheck, FilterX, MessageSquare } from "lucide-react";
import { addToast } from "@heroui/toast";

export default function AdminStatsManager({ token }: { token: string }) {
    // 👈 Ajout de 'commentaires' dans l'état initial
    const [stats, setStats] = useState({ creations: 0, exploitations: 0, consultations: 0, connexions: 0, commentaires: 0 });
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    // Filtres
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [categoryId, setCategoryId] = useState<Set<string>>(new Set([]));

    useEffect(() => {
        fetch("http://localhost:3001/category")
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

            const res = await fetch(`http://localhost:3001/admin/stats?${queryParams.toString()}`, {
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
            const res = await fetch("http://localhost:3001/admin/stats/export", {
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
            
            // Pour forcer l'UTF-8 avec Excel sur Windows, on ajoute un BOM (\uFEFF)
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
        <div className="w-full flex flex-col gap-8">
            {/* --- BARRE DE FILTRES --- */}
            <div className="flex flex-col lg:flex-row gap-4 items-end lg:items-center bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:flex-1">
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
                
                <div className="flex gap-2 w-full sm:w-auto shrink-0">
                    <Button 
                        variant="flat" 
                        color="default" 
                        className="h-12"
                        startContent={<FilterX size={18} />} 
                        onPress={handleResetFilters}
                    >
                        Réinitialiser
                    </Button>
                    <Button 
                        color="primary" 
                        className="bg-[#1B365D] h-12 font-bold" 
                        startContent={exporting ? <Spinner size="sm" color="white" /> : <Download size={18} />}
                        onPress={handleExport}
                        isDisabled={exporting}
                    >
                        Exporter (CSV)
                    </Button>
                </div>
            </div>

            {/* --- CARTES DE STATISTIQUES --- */}
            {loading ? (
                <div className="flex justify-center p-12"><Spinner size="lg" color="primary" /></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    
                    {/* Consultations */}
                    <Card className="border-none shadow-sm bg-blue-50/50">
                        <CardBody className="p-6 flex flex-row items-center gap-4">
                            <div className="p-4 bg-blue-100 text-blue-600 rounded-xl shrink-0">
                                <Eye size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Vues</p>
                                <p className="text-2xl font-bold text-[#1B365D]">{stats.consultations}</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Créations */}
                    <Card className="border-none shadow-sm bg-emerald-50/50">
                        <CardBody className="p-6 flex flex-row items-center gap-4">
                            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
                                <PlusCircle size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Créations</p>
                                <p className="text-2xl font-bold text-[#1B365D]">{stats.creations}</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Exploitations (Favoris/Sauvegardes) */}
                    <Card className="border-none shadow-sm bg-rose-50/50">
                        <CardBody className="p-6 flex flex-row items-center gap-4">
                            <div className="p-4 bg-rose-100 text-rose-600 rounded-xl shrink-0">
                                <Heart size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Favoris</p>
                                <p className="text-2xl font-bold text-[#1B365D]">{stats.exploitations}</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* 👈 NOUVEAU : Commentaires */}
                    <Card className="border-none shadow-sm bg-amber-50/50">
                        <CardBody className="p-6 flex flex-row items-center gap-4">
                            <div className="p-4 bg-amber-100 text-amber-600 rounded-xl shrink-0">
                                <MessageSquare size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Commentaires</p>
                                <p className="text-2xl font-bold text-[#1B365D]">{stats.commentaires}</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Connexions */}
                    <Card className="border-none shadow-sm bg-purple-50/50">
                        <CardBody className="p-6 flex flex-row items-center gap-4">
                            <div className="p-4 bg-purple-100 text-purple-600 rounded-xl shrink-0">
                                <UserCheck size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Connexions</p>
                                <p className="text-2xl font-bold text-[#1B365D]">{stats.connexions}</p>
                            </div>
                        </CardBody>
                    </Card>

                </div>
            )}
        </div>
    );
}