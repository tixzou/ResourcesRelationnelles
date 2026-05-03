"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Input } from "@heroui/input";
import { Ban, CheckCircle, Trash2, Search, Shield, MessageSquare, FileText, UserCircle } from "lucide-react";
import { addToast } from "@heroui/toast";

export default function AdminUsersManager({ token, currentUserId }: { token: string, currentUserId: number }) {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:3001/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                setUsers(data);
            }
        } catch (error) {
            addToast({ title: "Erreur réseau", color: "danger" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (token) fetchUsers(); }, [token]);

    const filteredUsers = users.filter((u) => {
        const query = search.toLowerCase();
        return (
            u.firstName?.toLowerCase().includes(query) ||
            u.lastName?.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query)
        );
    });

    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        try {
            const res = await fetch(`http://localhost:3001/admin/users/${id}/toggle-active`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !currentStatus } : u));
                addToast({ 
                    title: currentStatus ? "Compte suspendu" : "Compte réactivé", 
                    color: currentStatus ? "warning" : "success" 
                });
            }
        } catch (error) { addToast({ title: "Erreur réseau", color: "danger" }); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Voulez-vous vraiment supprimer cet utilisateur définitivement ? Toutes ses données seront perdues.")) return;
        try {
            const res = await fetch(`http://localhost:3001/admin/users/${id}`, {
                method: "DELETE", headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== id));
                addToast({ title: "Utilisateur supprimé", color: "success" });
            }
        } catch (error) { addToast({ title: "Erreur réseau", color: "danger" }); }
    };

    if (loading) return <div className="flex justify-center p-10 w-full"><Spinner size="lg" color="primary" /></div>;

    const formatRole = (role: string) => {
        switch (role) {
            case "SUPER_ADMINISTRATEUR": return "Super Admin";
            case "ADMINISTRATEUR": return "Administrateur";
            case "MODERATEUR": return "Modérateur";
            default: return "Citoyen";
        }
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 items-center w-full">
                <Input
                    value={search}
                    onValueChange={setSearch}
                    className="w-full"
                    placeholder="Rechercher par nom, prénom ou email..."
                    startContent={<Search size={20} className="text-gray-400" />}
                    variant="bordered"
                />
                <Button variant="flat" className="h-10 px-6 bg-gray-100 shrink-0" onPress={() => setSearch("")}>
                    Réinitialiser
                </Button>
            </div>

            <div className="flex flex-col gap-4 w-full">
                {filteredUsers.length === 0 ? (
                    <p className="text-gray-500 italic p-8 text-center border border-dashed rounded-xl bg-gray-50">Aucun utilisateur trouvé.</p>
                ) : (
                    filteredUsers.map(user => {
                        const isCurrentUser = user.id === currentUserId;

                        return (
                            // Utilisation d'une Grid au lieu de Flex pour garantir l'alignement
                            <div key={user.id} className={`grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-5 bg-white border rounded-xl shadow-sm transition-all ${!user.isActive ? 'border-orange-200 bg-orange-50/30' : 'border-gray-200 hover:shadow-md'} ${isCurrentUser ? 'border-blue-200 bg-blue-50/30' : ''}`}>
                                
                                {/* Colonne 1 : Infos Citoyen (Prend 5 colonnes sur 12) */}
                                <div className="flex flex-col gap-1 lg:col-span-5">
                                    <div className="flex items-center gap-2">
                                        <h3 className={`font-bold text-base line-clamp-1 ${!user.isActive ? 'text-gray-500' : 'text-[#1B365D]'}`}>
                                            {user.firstName} {user.lastName}
                                        </h3>
                                        <Chip size="sm" variant="flat" color={user.isActive ? "success" : "danger"} className="text-[10px] font-bold h-5 px-1 shrink-0">
                                            {user.isActive ? "ACTIF" : "SUSPENDU"}
                                        </Chip>
                                    </div>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    
                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                                        <span>Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                                        <span className="text-gray-300">•</span>
                                        <div className="flex items-center gap-1">
                                            <FileText size={12} /> {user._count?.ressources || 0} ressources
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageSquare size={12} /> {user._count?.comments || 0} commentaires
                                        </div>
                                    </div>
                                </div>

                                {/* Colonne 2 : Affichage du Rôle (Prend 3 colonnes sur 12) */}
                                <div className="flex items-center gap-2 lg:col-span-3">
                                    <Shield size={18} className={user.role === "CITOYEN" ? "text-gray-400" : "text-blue-600"} />
                                    <span className={`text-sm font-medium ${user.role === "CITOYEN" ? "text-gray-500" : "text-[#1B365D]"}`}>
                                        {formatRole(user.role)}
                                    </span>
                                </div>

                                {/* Colonne 3 : Actions Administrateur (Prend 4 colonnes sur 12, collé à droite) */}
                                <div className="flex items-center gap-2 justify-start lg:justify-end lg:col-span-4">
                                    {isCurrentUser ? (
                                        <Chip 
                                            size="sm" 
                                            variant="flat" 
                                            color="primary" 
                                            startContent={<UserCircle size={14} className="ml-1" />}
                                            className="font-bold px-2 py-4"
                                        >
                                            Votre compte
                                        </Chip>
                                    ) : (
                                        <>
                                            <Button 
                                                color={user.isActive ? "warning" : "success"}
                                                size="sm"
                                                variant="flat" 
                                                startContent={user.isActive ? <Ban size={16} /> : <CheckCircle size={16} />}
                                                onPress={() => handleToggleActive(user.id, user.isActive)}
                                            >
                                                {user.isActive ? "Suspendre" : "Réactiver"}
                                            </Button>
                                            
                                            <Button isIconOnly color="danger" size="sm" variant="light" onPress={() => handleDelete(user.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}