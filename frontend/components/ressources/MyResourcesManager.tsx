"use client";

import { useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@heroui/modal";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input"; // Utilisation de Textarea de HeroUI
import { Select, SelectItem } from "@heroui/select"; // Utilisation du Select de HeroUI
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Trash2, Edit, Plus } from "lucide-react";
import { addToast } from "@heroui/toast";

type MyRessourceManagerProps = {
    token: string;
    search: string;
    category: string;
    type: string;
};

export default function MyResourcesManager({ token, search, category, type }: MyRessourceManagerProps) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [myRessources, setMyRessources] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // États du formulaire
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formType, setFormType] = useState(new Set(["ARTICLE"]));
    const [formCategoryId, setFormCategoryId] = useState(new Set<string>([]));

    // Filtrage local
    const filteredMyRessources = myRessources.filter((r) => {
        const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
        const matchCategory = category ? r.category?.name === category : true;
        const matchType = type ? r.type === type : true;
        return matchSearch && matchCategory && matchType;
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resRessources, resCats] = await Promise.all([
                fetch("http://localhost:3001/ressource/me", { headers: { Authorization: `Bearer ${token}` } }),
                fetch("http://localhost:3001/category")
            ]);
            const dataR = await resRessources.json();
            const dataC = await resCats.json();

            if (Array.isArray(dataR)) setMyRessources(dataR);
            if (Array.isArray(dataC)) setCategories(dataC);
        } catch (error) {
            console.error("Erreur chargement:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (token) fetchData(); }, [token]);

    // Ouverture du modal pour création
    const handleOpenCreate = () => {
        setEditingId(null);
        setFormTitle("");
        setFormContent("");
        setFormType(new Set(["ARTICLE"]));
        setFormCategoryId(new Set([]));
        onOpen();
    };

    // Ouverture du modal pour édition
    const handleOpenEdit = (ressource: any) => {
        setEditingId(ressource.id);
        setFormTitle(ressource.title);
        setFormContent(ressource.content || "");
        setFormType(new Set([ressource.type]));
        setFormCategoryId(new Set([ressource.categoryId?.toString() || ""]));
        onOpen();
    };

    const handleSubmit = async () => {
        const url = editingId ? `http://localhost:3001/ressource/${editingId}` : "http://localhost:3001/ressource";
        const method = editingId ? "PUT" : "POST";
        const selectedType = Array.from(formType)[0];
        const selectedCat = Array.from(formCategoryId)[0];

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    title: formTitle,
                    content: formContent,
                    type: selectedType,
                    isPublic: true,
                    categoryId: selectedCat ? parseInt(selectedCat) : null
                })
            });

            if (res.ok) {
                addToast({ title: "Succès", description: editingId ? "Mis à jour" : "Créé", color: "success" });
                onClose();
                fetchData();
            }
        } catch (error) {
            addToast({ title: "Erreur", color: "danger" });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Supprimer cette ressource ?")) return;
        try {
            const res = await fetch(`http://localhost:3001/ressource/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setMyRessources(prev => prev.filter(r => r.id !== id));
                addToast({ title: "Supprimé", color: "success" });
            }
        } catch (error) { console.error(error); }
    };

    if (loading) return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#1B365D]">Mes publications</h2>
                <Button color="primary" startContent={<Plus size={18} />} onPress={handleOpenCreate}>
                    Nouvelle ressource
                </Button>
            </div>

            {/* LISTE DES CARTES */}
            <div className="flex flex-col gap-4">
                {filteredMyRessources.map(r => (
                    <Card key={r.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardBody className="flex flex-row justify-between items-center p-5">
                            <div>
                                <h3 className="font-bold text-lg text-[#1B365D]">{r.title}</h3>
                                <div className="flex gap-2 mt-2">
                                    <Chip size="sm" variant="flat" color="primary">{r.type}</Chip>
                                    {r.category && <Chip size="sm" color="secondary" variant="flat">{r.category.name}</Chip>}
                                    <Chip size="sm" color={r.isPublic ? "success" : "warning"} variant="dot">
                                        {r.isPublic ? "Publique" : "Privée"}
                                    </Chip>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button isIconOnly variant="light" onPress={() => handleOpenEdit(r)}><Edit size={20} /></Button>
                                <Button isIconOnly color="danger" variant="light" onPress={() => handleDelete(r.id)}><Trash2 size={20} /></Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* MODAL DE FORMULAIRE (Même style que ton AuthModal) */}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                backdrop="blur"
                size="lg"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {editingId ? "Modifier la ressource" : "Créer une nouvelle ressource"}
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-4">
                                    <Input
                                        label="Titre"
                                        placeholder="Entrez le titre..."
                                        variant="bordered"
                                        value={formTitle}
                                        onValueChange={setFormTitle}
                                    />

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {/* Pour les catégories */}
                                        <Select
                                            label="Catégorie"
                                            variant="bordered"
                                            selectedKeys={formCategoryId}
                                            onSelectionChange={(keys) => setFormCategoryId(keys as any)}
                                        >
                                            {categories.map((cat) => (
                                                // ON UTILISE UNIQUEMENT key, ON SUPPRIME value
                                                <SelectItem key={cat.id.toString()}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </Select>

                                        <Select
                                            label="Type"
                                            variant="bordered"
                                            selectedKeys={formType}
                                            onSelectionChange={(keys) => setFormType(keys as any)}
                                        >
                                            {/* ON UTILISE UNIQUEMENT key */}
                                            <SelectItem key="ARTICLE">Article</SelectItem>
                                            <SelectItem key="VIDEO">Vidéo</SelectItem>
                                            <SelectItem key="JEU">Jeu</SelectItem>
                                        </Select>
                                    </div>

                                    <Textarea
                                        label="Contenu"
                                        placeholder="Écrivez le contenu ou insérez un lien..."
                                        variant="bordered"
                                        minRows={4}
                                        value={formContent}
                                        onValueChange={setFormContent}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>Annuler</Button>
                                <Button color="primary" className="bg-[#003E7E]" onPress={handleSubmit}>
                                    {editingId ? "Enregistrer les modifications" : "Publier"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}