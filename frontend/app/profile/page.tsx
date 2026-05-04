"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Lock, Eye, EyeOff } from "lucide-react";
import { addToast } from "@heroui/toast";

export default function ProfilePage() {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [originalData, setOriginalData] = useState({ firstName: "", lastName: "", email: "" });

    const { 
        isOpen: isPasswordOpen, 
        onOpen: onPasswordOpen, 
        onOpenChange: onPasswordOpenChange, 
        onClose: onPasswordClose 
    } = useDisclosure();

    const { 
        isOpen: isConfirmOpen, 
        onOpen: onConfirmOpen, 
        onOpenChange: onConfirmOpenChange, 
        onClose: onConfirmClose 
    } = useDisclosure();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isVisibleOld, setIsVisibleOld] = useState(false);
    const [isVisibleNew, setIsVisibleNew] = useState(false);
    const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return;
            try {
                const res = await fetch("http://localhost:3001/user/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setFirstName(data.firstName);
                    setLastName(data.lastName);
                    setEmail(data.email);
                    setOriginalData({ firstName: data.firstName, lastName: data.lastName, email: data.email });
                }
            } catch (error) {
                addToast({ title: "Erreur de chargement", color: "danger" });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const res = await fetch("http://localhost:3001/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ firstName, lastName, email })
            });

            if (res.ok) {
                addToast({ title: "Informations mises à jour", color: "success" });
                setOriginalData({ firstName, lastName, email });
                setIsEditing(false);
                onConfirmClose();
            } else {
                const err = await res.json();
                addToast({ title: err.message || "Erreur", color: "danger" });
            }
        } catch (error) {
            addToast({ title: "Erreur réseau", color: "danger" });
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setFirstName(originalData.firstName);
        setLastName(originalData.lastName);
        setEmail(originalData.email);
        setIsEditing(false);
    };

    const handleSavePassword = async () => {
        if (newPassword !== confirmPassword) {
            addToast({ title: "Les mots de passe ne correspondent pas", color: "danger" });
            return;
        }

        try {
            const res = await fetch("http://localhost:3001/user/profile/password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ oldPassword, newPassword })
            });

            if (res.ok) {
                addToast({ title: "Mot de passe modifié", color: "success" });
                setOldPassword(""); 
                setNewPassword(""); 
                setConfirmPassword("");
                onPasswordClose();
            } else {
                const err = await res.json();
                addToast({ title: err.message || "Erreur", color: "danger" });
            }
        } catch (error) {
            addToast({ title: "Erreur réseau", color: "danger" });
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center pt-24"><Spinner size="lg" color="primary" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-[#1B365D] mb-8">Mon Compte</h1>

                <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xl text-gray-800 mb-8">
                        Bienvenue sur votre espace, <span className="font-bold text-[#1B365D]">{originalData.firstName}</span> !
                    </p>

                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Input 
                                label="Prénom" 
                                variant="bordered" 
                                value={firstName} 
                                onValueChange={setFirstName} 
                                size="lg"
                                isReadOnly={!isEditing}
                            />
                            <Input 
                                label="Nom" 
                                variant="bordered" 
                                value={lastName} 
                                onValueChange={setLastName} 
                                size="lg"
                                isReadOnly={!isEditing}
                            />
                        </div>

                        <Input 
                            label="Email" 
                            type="email" 
                            variant="bordered" 
                            value={email} 
                            onValueChange={setEmail} 
                            size="lg"
                            isReadOnly={!isEditing}
                        />

                        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                            <Button 
                                color="primary" 
                                className="w-full sm:w-auto bg-[#1B365D] font-bold px-6 h-12"
                                startContent={<Lock size={18} />}
                                onPress={onPasswordOpen}
                            >
                                Modifier le mot de passe
                            </Button>

                            {!isEditing ? (
                                <Button 
                                    color="primary" 
                                    className="w-full sm:w-auto bg-[#003E7E] font-bold px-8 h-12"
                                    onPress={() => setIsEditing(true)}
                                >
                                    Modifier mes informations
                                </Button>
                            ) : (
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button 
                                        color="danger" 
                                        variant="flat" 
                                        className="font-bold px-6 h-12"
                                        onPress={handleCancelEdit}
                                    >
                                        Annuler
                                    </Button>
                                    <Button 
                                        color="primary" 
                                        className="bg-[#003E7E] font-bold px-8 h-12"
                                        onPress={onConfirmOpen}
                                    >
                                        Valider
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isConfirmOpen} onOpenChange={onConfirmOpenChange} backdrop="blur" placement="center">
                <ModalContent className="rounded-2xl p-2">
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-xl font-bold text-[#1B365D]">Confirmer les modifications</ModalHeader>
                            <ModalBody>
                                <p className="text-gray-600">
                                    Êtes-vous sûr de vouloir enregistrer ces nouvelles informations ?
                                </p>
                            </ModalBody>
                            <ModalFooter className="mt-4">
                                <Button color="danger" variant="light" onPress={onClose} className="font-medium">
                                    Annuler
                                </Button>
                                <Button color="primary" className="bg-[#1B365D] font-bold px-6" isLoading={saving} onPress={handleSaveProfile}>
                                    Oui, valider
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={isPasswordOpen} onOpenChange={onPasswordOpenChange} backdrop="blur" placement="center">
                <ModalContent className="rounded-2xl p-2">
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-xl font-bold text-[#1B365D]">Changer le mot de passe</ModalHeader>
                            <ModalBody className="gap-5">
                                <Input
                                    label="Mot de passe actuel"
                                    variant="bordered"
                                    type={isVisibleOld ? "text" : "password"}
                                    value={oldPassword}
                                    onValueChange={setOldPassword}
                                    endContent={
                                        <button className="focus:outline-none" type="button" onClick={() => setIsVisibleOld(!isVisibleOld)}>
                                            {isVisibleOld ? <Eye className="text-gray-400" size={20} /> : <EyeOff className="text-gray-400" size={20} />}
                                        </button>
                                    }
                                />
                                <Input
                                    label="Nouveau mot de passe"
                                    variant="bordered"
                                    type={isVisibleNew ? "text" : "password"}
                                    value={newPassword}
                                    onValueChange={setNewPassword}
                                    endContent={
                                        <button className="focus:outline-none" type="button" onClick={() => setIsVisibleNew(!isVisibleNew)}>
                                            {isVisibleNew ? <Eye className="text-gray-400" size={20} /> : <EyeOff className="text-gray-400" size={20} />}
                                        </button>
                                    }
                                />
                                <Input
                                    label="Confirmer le nouveau mot de passe"
                                    variant="bordered"
                                    type={isVisibleConfirm ? "text" : "password"}
                                    value={confirmPassword}
                                    onValueChange={setConfirmPassword}
                                    endContent={
                                        <button className="focus:outline-none" type="button" onClick={() => setIsVisibleConfirm(!isVisibleConfirm)}>
                                            {isVisibleConfirm ? <Eye className="text-gray-400" size={20} /> : <EyeOff className="text-gray-400" size={20} />}
                                        </button>
                                    }
                                />
                            </ModalBody>
                            <ModalFooter className="mt-4">
                                <Button color="danger" variant="light" onPress={onClose} className="font-medium">
                                    Annuler
                                </Button>
                                <Button color="primary" className="bg-[#1B365D] font-bold px-6" onPress={handleSavePassword}>
                                    Modifier
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

/**
 * Documentation du fichier
 *
 * - Role : Page "Mon Compte" (Profil utilisateur). Permet a un citoyen de consulter et modifier ses informations personnelles et son mot de passe.
 * - Fonctionnement : Les champs sont verrouilles par defaut. Un clic sur "Modifier" les debloque. Un clic sur "Annuler" restaure les donnees initiales grace a originalData. Un clic sur "Valider" ouvre une modale de confirmation.
 * - A retenir : Deux modales distinctes sont gerees avec useDisclosure() pour les informations et le mot de passe. L'etat originalData garantit qu'aucune donnee n'est modifiee visuellement si la requete n'est pas validee.
 */