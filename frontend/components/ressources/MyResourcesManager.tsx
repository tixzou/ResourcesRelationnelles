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
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Tabs, Tab } from "@heroui/tabs";
import { Trash2, Edit, Plus, Info, BookOpen, Heart } from "lucide-react";
import { addToast } from "@heroui/toast";
import FavoriteResourcesList from "./FavoriteResourcesList";

type MyRessourceManagerProps = {
    token: string;
    search: string;
    category: string;
};

export default function MyResourcesManager({ token, search, category }: MyRessourceManagerProps) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [selectedTab, setSelectedTab] = useState("mes-publications");

    const [myRessources, setMyRessources] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formType, setFormType] = useState(new Set(["ARTICLE"]));
    const [formCategoryId, setFormCategoryId] = useState(new Set<string>([]));

    const filteredMyRessources = myRessources.filter((r) => {
        const safeTitle = r.title?.toLowerCase() || "";
        const matchSearch = safeTitle.includes(search.toLowerCase());
        const matchCategory = category ? r.category?.name === category : true;
        return matchSearch && matchCategory;
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

    const handleOpenCreate = () => {
        setEditingId(null);
        setFormTitle("");
        setFormContent("");
        setFormType(new Set(["ARTICLE"]));
        setFormCategoryId(new Set([]));
        onOpen();
    };

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
                addToast({
                    title: "Succès",
                    description: editingId ? "Modifications soumises." : "Ressource créée !",
                    color: "success"
                });
                onClose();
                fetchData();
            }
        } catch (error) {
            addToast({ title: "Erreur", color: "danger" });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Voulez-vous vraiment supprimer cette ressource ?")) return;
        try {
            const res = await fetch(`http://localhost:3001/ressource/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setMyRessources(prev => prev.filter(r => r.id !== id));
                addToast({ title: "Supprimée", color: "success" });
            }
        } catch (error) { console.error(error); }
    };

    if (loading) return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
                <Tabs
                    aria-label="Options"
                    color="primary"
                    variant="underlined"
                    selectedKey={selectedTab}
                    onSelectionChange={(key) => setSelectedTab(key as string)}
                    classNames={{
                        tabList: "gap-6",
                        cursor: "w-full bg-[#1B365D]",
                        tabContent: "group-data-[selected=true]:text-[#1B365D] font-bold"
                    }}
                >
                    <Tab
                        key="mes-publications"
                        title={
                            <div className="flex items-center space-x-2">
                                <BookOpen size={18} />
                                <span>Mes publications</span>
                            </div>
                        }
                    />
                    <Tab
                        key="mes-favoris"
                        title={
                            <div className="flex items-center space-x-2">
                                <Heart size={18} />
                                <span>Mes favoris</span>
                            </div>
                        }
                    />
                </Tabs>

                {selectedTab === "mes-publications" && (
                    <Button color="primary" startContent={<Plus size={18} />} onPress={handleOpenCreate}>
                        Nouvelle ressource
                    </Button>
                )}
            </div>

            <div className="mt-4">
                {selectedTab === "mes-publications" ? (
                    <div className="flex flex-col gap-4 w-full text-left">
                        {filteredMyRessources.length === 0 ? (
                            <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center text-gray-500">
                                Aucune publication trouvée.
                            </div>
                        ) : (
                            filteredMyRessources.map(r => (
                                <Card key={r.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <CardBody className="flex flex-row justify-between items-center p-5 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <h3 className="font-bold text-lg text-[#1B365D] leading-tight">{r.title}</h3>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Chip size="sm" variant="flat" color="primary">{r.type}</Chip>
                                                {r.category && <Chip size="sm" color="secondary" variant="flat">{r.category.name}</Chip>}
                                                <Chip
                                                    size="sm"
                                                    color={r.isValidated ? "success" : "warning"}
                                                    variant="flat"
                                                >
                                                    {r.isValidated ? "Approuvée" : "En attente"}
                                                </Chip>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button isIconOnly variant="light" onPress={() => handleOpenEdit(r)}>
                                                <Edit size={20} className="text-gray-600" />
                                            </Button>
                                            <Button isIconOnly color="danger" variant="light" onPress={() => handleDelete(r.id)}>
                                                <Trash2 size={20} />
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))
                        )}
                    </div>
                ) : (
                    <FavoriteResourcesList token={token} />
                )}
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur" size="lg">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {editingId ? "Modifier la ressource" : "Créer une nouvelle ressource"}
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex items-start gap-3 bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-2">
                                    <Info size={20} className="shrink-0 mt-0.5" />
                                    <p>Toute modification sera soumise à validation.</p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Input label="Titre" placeholder="Titre..." variant="bordered" value={formTitle} onValueChange={setFormTitle} />
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Select label="Catégorie" variant="bordered" selectedKeys={formCategoryId} onSelectionChange={(keys) => setFormCategoryId(keys as any)}>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id.toString()}>{cat.name}</SelectItem>
                                            ))}
                                        </Select>
                                        <Select label="Type" variant="bordered" selectedKeys={formType} onSelectionChange={(keys) => setFormType(keys as any)}>
                                            <SelectItem key="ARTICLE">Article</SelectItem>
                                            <SelectItem key="VIDEO">Vidéo</SelectItem>
                                            <SelectItem key="JEU">Jeu</SelectItem>
                                        </Select>
                                    </div>
                                    <Textarea label="Contenu" placeholder="Contenu..." variant="bordered" minRows={4} value={formContent} onValueChange={setFormContent} />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>Annuler</Button>
                                <Button color="primary" className="bg-[#003E7E]" onPress={handleSubmit}>
                                    {editingId ? "Soumettre" : "Publier"}
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
 * - Role : Gestionnaire des ressources de l'utilisateur connecte. Il charge ses ressources et les categories depuis le backend.
 * - Fonctionnement : Il permet de creer, editer et supprimer une ressource personnelle avec formulaire local.
 * - A retenir : Lors d'une edition, la ressource repasse cote backend en attente de validation.
 */
