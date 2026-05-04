"use client";

import { useEffect, useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { CheckCircle, XCircle, Ban, Trash2, Edit, Search, Plus, FolderTree, MessageSquare } from "lucide-react";
import { addToast } from "@heroui/toast";

export default function AdminRessourcesManager({ token, role }: { token: string, role: string }) {
    const [ressources, setRessources] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("pending");

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const { isOpen: isResOpen, onOpen: onResOpen, onOpenChange: onResOpenChange, onClose: onResClose } = useDisclosure();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formType, setFormType] = useState(new Set(["ARTICLE"]));
    const [formCategoryId, setFormCategoryId] = useState(new Set<string>([]));

    const { isOpen: isCatOpen, onOpen: onCatOpen, onOpenChange: onCatOpenChange, onClose: onCatClose } = useDisclosure();
    const [editingCatId, setEditingCatId] = useState<number | null>(null);
    const [formCatName, setFormCatName] = useState("");

    const { isOpen: isComOpen, onOpen: onComOpen, onOpenChange: onComOpenChange, onClose: onComClose } = useDisclosure();
    const [activeResId, setActiveResId] = useState<number | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [replyingToId, setReplyingToId] = useState<number | null>(null);
    const [replyText, setReplyText] = useState("");

    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onOpenChange: onConfirmOpenChange, onClose: onConfirmClose } = useDisclosure();
    const [deleteTarget, setDeleteTarget] = useState<{ type: "ressource" | "category" | "comment", id: number } | null>(null);

    const isAdmin = role === "ADMINISTRATEUR" || role === "SUPER_ADMINISTRATEUR";

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resRessources, resCats] = await Promise.all([
                fetch("http://localhost:3001/admin/ressources", { headers: { Authorization: `Bearer ${token}` } }),
                fetch("http://localhost:3001/category")
            ]);
            const dataR = await resRessources.json();
            const dataC = await resCats.json();

            if (resRessources.ok) setRessources(dataR);
            if (resCats.ok) setCategories(dataC);
        } catch (error) {
            addToast({ title: "Erreur de connexion", color: "danger" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (token) fetchData(); }, [token]);

    const filteredRessources = ressources.filter((r) => {
        const safeTitle = r.title?.toLowerCase() || "";
        const safeContent = r.content?.toLowerCase() || "";
        const searchLower = search.toLowerCase();
        const matchSearch = safeTitle.includes(searchLower) || safeContent.includes(searchLower);
        const matchCategory = categoryFilter ? r.category?.name === categoryFilter : true;
        return matchSearch && matchCategory;
    });

    const pendingRessources = filteredRessources.filter(r => !r.isValidated);
    const validatedRessources = filteredRessources.filter(r => r.isValidated);

    const openDeleteModal = (type: "ressource" | "category" | "comment", id: number) => {
        setDeleteTarget({ type, id });
        onConfirmOpen();
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        const { type, id } = deleteTarget;

        if (type === "ressource") await handleAction(id, "delete");
        else if (type === "category") await handleDeleteCat(id);
        else if (type === "comment") await handleDeleteComment(id);

        onConfirmClose();
        setDeleteTarget(null);
    };

    const handleAction = async (id: number, action: "validate" | "suspend" | "delete") => {
        const urlMap = {
            validate: `http://localhost:3001/admin/ressources/${id}/validate`,
            suspend: `http://localhost:3001/admin/ressources/${id}/suspend`,
            delete: `http://localhost:3001/admin/ressources/${id}`
        };
        const methodMap = { validate: "PATCH", suspend: "PATCH", delete: "DELETE" };

        try {
            const res = await fetch(urlMap[action], { method: methodMap[action], headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) { addToast({ title: "Action réussie", color: "success" }); fetchData(); }
            else { addToast({ title: "Erreur", color: "danger" }); }
        } catch (error) { addToast({ title: "Erreur réseau", color: "danger" }); }
    };

    const handleSaveRes = async () => {
        const url = editingId ? `http://localhost:3001/admin/ressources/${editingId}` : `http://localhost:3001/ressource`;
        const method = editingId ? "PUT" : "POST";
        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    title: formTitle, content: formContent, type: Array.from(formType)[0], isPublic: true,
                    categoryId: Array.from(formCategoryId)[0] ? parseInt(Array.from(formCategoryId)[0] as string) : null
                })
            });
            if (res.ok) {
                addToast({ title: "Sauvegardé avec succès", color: "success" });
                onResClose(); fetchData();
                if (!editingId) setSelectedTab("pending");
            } else { addToast({ title: "Erreur", color: "danger" }); }
        } catch (error) { addToast({ title: "Erreur réseau", color: "danger" }); }
    };

    const handleOpenComments = async (resId: number) => {
        setActiveResId(resId);
        setComments([]);
        setReplyingToId(null);
        setReplyText("");
        onComOpen();
        fetchComments(resId);
    };

    const fetchComments = async (resId: number) => {
        setLoadingComments(true);
        try {
            const res = await fetch(`http://localhost:3001/comment/ressource/${resId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            addToast({ title: "Erreur chargement des commentaires", color: "danger" });
        } finally {
            setLoadingComments(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            const res = await fetch(`http://localhost:3001/comment/admin/${commentId}`, {
                method: "DELETE", headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                addToast({ title: "Commentaire supprimé", color: "success" });
                if (activeResId) fetchComments(activeResId);
            } else {
                addToast({ title: "Erreur lors de la suppression", color: "danger" });
            }
        } catch (error) { addToast({ title: "Erreur réseau", color: "danger" }); }
    };

    const handlePostReply = async (parentId: number) => {
        if (!replyText.trim() || !activeResId) return;
        try {
            const res = await fetch(`http://localhost:3001/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    content: replyText,
                    ressourceId: activeResId,
                    parentId: parentId
                })
            });
            if (res.ok) {
                setReplyText("");
                setReplyingToId(null);
                addToast({ title: "Réponse publiée", color: "success" });
                fetchComments(activeResId);
            } else {
                addToast({ title: "Erreur lors de la réponse", color: "danger" });
            }
        } catch (error) { addToast({ title: "Erreur réseau", color: "danger" }); }
    };

    const renderCommentNode = (comment: any, level: number = 0) => {
        const children = comments.filter(c => c.parentId === comment.id);
        const isRoot = level === 0;

        return (
            <div key={comment.id} className={isRoot ? "bg-gray-50 p-3 md:p-4 rounded-xl border border-gray-100" : "ml-4 md:ml-8 mt-3 p-3 bg-white border border-gray-100 rounded-lg"}>
                <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="min-w-0">
                        <p className={`font-bold ${isRoot ? 'text-sm' : 'text-xs'} text-[#1B365D] truncate`}>
                            {comment.author?.firstName} {comment.author?.lastName}
                        </p>
                        <p className="text-[10px] text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                    </div>
                    <div className="flex gap-1 items-center shrink-0">
                        <Button size="sm" variant="light" color="primary" className="h-7 min-w-0 px-2 text-[11px]" onPress={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}>
                            Répondre
                        </Button>
                        <Button size="sm" isIconOnly variant="light" color="danger" className="h-7 w-7 min-w-0" onPress={() => openDeleteModal("comment", comment.id)} title="Supprimer">
                            <Trash2 size={14}/>
                        </Button>
                    </div>
                </div>

                <p className={`${isRoot ? 'text-sm text-gray-700' : 'text-xs text-gray-600'} break-words`}>{comment.content}</p>

                {replyingToId === comment.id && (
                    <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        <Input
                            size="sm"
                            variant="bordered"
                            placeholder="Répondre..."
                            value={replyText}
                            onValueChange={setReplyText}
                            autoFocus
                            className="flex-1"
                        />
                        <Button size="sm" color="primary" className="bg-[#1B365D] w-full sm:w-auto" onPress={() => handlePostReply(comment.id)}>
                            Envoyer
                        </Button>
                    </div>
                )}

                {children.length > 0 && (
                    <div className="mt-1">
                        {children.map(child => renderCommentNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    const handleSaveCat = async () => {
        const url = editingCatId ? `http://localhost:3001/category/${editingCatId}` : `http://localhost:3001/category`;
        const method = editingCatId ? "PATCH" : "POST";
        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: formCatName })
            });
            if (res.ok) {
                addToast({ title: "Catégorie sauvegardée", color: "success" });
                onCatClose(); fetchData();
            } else { addToast({ title: "Erreur", color: "danger" }); }
        } catch (error) { addToast({ title: "Erreur réseau", color: "danger" }); }
    };

    const handleDeleteCat = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:3001/category/${id}`, {
                method: "DELETE", headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                addToast({ title: "Catégorie supprimée", color: "success" }); fetchData();
            } else { addToast({ title: "Erreur", color: "danger" }); }
        } catch (error) { addToast({ title: "Erreur réseau", color: "danger" }); }
    };

    if (loading) return <div className="flex justify-center p-10 w-full"><Spinner size="lg" color="primary" /></div>;

    const renderResListItem = (r: any, isPending: boolean) => (
        <div key={r.id} className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 md:p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all gap-4">
            <div className="flex flex-col gap-1 w-full lg:w-2/3">
                <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm md:text-base text-[#1B365D] line-clamp-1">{r.title}</h3>
                    <Chip size="sm" variant="flat" color={isPending ? "warning" : "success"} className="text-[10px] font-bold h-5 px-1 shrink-0">
                        {isPending ? "EN ATTENTE" : "PUBLIÉE"}
                    </Chip>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                    <span className="text-xs md:text-sm text-gray-500">Par <span className="font-semibold text-gray-700">{r.author.firstName} {r.author.lastName}</span></span>
                    <span className="hidden xs:inline text-gray-300">•</span>
                    <span className="text-[10px] md:text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</span>
                    <span className="hidden xs:inline text-gray-300">•</span>
                    <Chip size="sm" variant="flat" className="bg-gray-100 border border-gray-200 text-gray-600 text-[10px] h-5">{r.type}</Chip>
                    {r.category && <Chip size="sm" variant="dot" color="secondary" className="border-none text-gray-500 text-[10px] h-5">{r.category.name}</Chip>}
                </div>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto justify-end lg:justify-start shrink-0 pt-2 lg:pt-0 border-t lg:border-none border-gray-100">
                <Button isIconOnly variant="flat" color="primary" size="sm" onPress={() => handleOpenComments(r.id)} title="Commentaires">
                    <MessageSquare size={16} />
                </Button>

                {isAdmin && (
                    <Button isIconOnly variant="flat" color="default" size="sm" onPress={() => {
                        setEditingId(r.id); setFormTitle(r.title); setFormContent(r.content || "");
                        setFormType(new Set([r.type])); setFormCategoryId(new Set([r.categoryId?.toString() || ""]));
                        onResOpen();
                    }}><Edit size={16} /></Button>
                )}

                {isPending ? (
                    <div className="flex gap-2">
                        <Button isIconOnly color="danger" variant="flat" size="sm" onPress={() => openDeleteModal("ressource", r.id)} title="Rejeter"><XCircle size={16} /></Button>
                        <Button color="success" size="sm" className="text-white font-medium" startContent={<CheckCircle size={16} />} onPress={() => handleAction(r.id, "validate")}>
                            <span className="hidden sm:inline">Approuver</span>
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        {isAdmin && (
                            <Button color="warning" size="sm" variant="flat" startContent={<Ban size={16} />} onPress={() => handleAction(r.id, "suspend")}>
                                <span className="hidden sm:inline">Suspendre</span>
                            </Button>
                        )}
                        {isAdmin && (
                            <Button isIconOnly color="danger" size="sm" variant="light" onPress={() => openDeleteModal("ressource", r.id)}><Trash2 size={16} /></Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="w-full flex flex-col gap-6 px-1">

            {selectedTab !== "categories" && (
                <div className="flex flex-col lg:flex-row gap-3 items-center w-full">
                    <Input 
                        value={search} 
                        onValueChange={setSearch} 
                        className="w-full lg:flex-1" 
                        placeholder="Rechercher..." 
                        startContent={<Search size={20} className="text-gray-400" />} 
                        variant="bordered" 
                    />
                    <div className="flex flex-wrap sm:flex-nowrap w-full lg:w-auto gap-2">
                        <select 
                            value={categoryFilter} 
                            onChange={(e) => setCategoryFilter(e.target.value)} 
                            className="flex-1 sm:w-48 bg-white border border-gray-200 rounded-xl px-4 h-10 text-sm outline-none cursor-pointer min-w-[140px]"
                        >
                            <option value="">Toutes catégories</option>
                            {categories.map((cat) => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
                        </select>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button variant="flat" className="h-10 bg-gray-100 flex-1 sm:flex-none" onPress={() => { setSearch(""); setCategoryFilter(""); }}>Réinitialiser</Button>
                            {isAdmin && (
                                <Button color="primary" className="h-10 bg-[#1B365D] flex-1 sm:flex-none" startContent={<Plus size={18} />} onPress={() => {
                                    setEditingId(null); setFormTitle(""); setFormContent(""); setFormType(new Set(["ARTICLE"])); setFormCategoryId(new Set([]));
                                    onResOpen();
                                }}>Créer</Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Tabs 
                selectedKey={selectedTab} 
                onSelectionChange={(k) => setSelectedTab(k as string)} 
                variant="underlined" 
                color="primary" 
                classNames={{ 
                    tabList: "gap-4 md:gap-6 w-full border-b border-gray-200 p-0 overflow-x-auto", 
                    cursor: "bg-[#1B365D]", 
                    tabContent: "group-data-[selected=true]:text-[#1B365D] font-bold text-xs md:text-sm" 
                }}
            >
                <Tab key="pending" title={<div className="flex items-center gap-2">À vérifier <Chip size="sm" color="warning" className="text-white border-none h-4 px-1 text-[10px]">{pendingRessources.length}</Chip></div>}>
                    <div className="pt-4 flex flex-col gap-4">
                        {pendingRessources.length === 0 ? <p className="text-gray-500 italic p-8 text-center border border-dashed rounded-xl bg-gray-50">Aucune ressource en attente.</p> : pendingRessources.map(r => renderResListItem(r, true))}
                    </div>
                </Tab>
                <Tab key="validated" title={`Publiées (${validatedRessources.length})`}>
                    <div className="pt-4 flex flex-col gap-4">
                        {validatedRessources.length === 0 ? <p className="text-gray-500 italic p-8 text-center border border-dashed rounded-xl bg-gray-50">Aucune ressource publiée.</p> : validatedRessources.map(r => renderResListItem(r, false))}
                    </div>
                </Tab>

                {isAdmin && (
                    <Tab key="categories" title={<div className="flex items-center gap-2"><FolderTree size={16}/> <span className="hidden md:inline">Catégories</span></div>}>
                        <div className="pt-4 flex flex-col gap-4">
                            <div className="flex justify-end mb-2">
                                <Button color="primary" className="bg-[#1B365D] w-full sm:w-auto" startContent={<Plus size={18} />} onPress={() => {
                                    setEditingCatId(null); setFormCatName(""); onCatOpen();
                                }}>Nouvelle catégorie</Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {categories.map(cat => (
                                    <div key={cat.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                                        <span className="font-bold text-[#1B365D] truncate mr-2">{cat.name}</span>
                                        <div className="flex gap-1 shrink-0">
                                            <Button isIconOnly variant="flat" size="sm" onPress={() => {
                                                setEditingCatId(cat.id); setFormCatName(cat.name); onCatOpen();
                                            }}><Edit size={16} /></Button>
                                            <Button isIconOnly color="danger" variant="light" size="sm" onPress={() => openDeleteModal("category", cat.id)}><Trash2 size={16} /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Tab>
                )}
            </Tabs>

            <Modal isOpen={isResOpen} onOpenChange={onResOpenChange} size="lg" backdrop="blur" scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-lg md:text-xl font-bold text-[#1B365D]">{editingId ? "Modifier" : "Créer"} une ressource</ModalHeader>
                            <ModalBody className="gap-4">
                                <Input label="Titre" variant="bordered" value={formTitle} onValueChange={setFormTitle} />
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Select label="Catégorie" variant="bordered" selectedKeys={formCategoryId} onSelectionChange={(k) => setFormCategoryId(k as any)}>
                                        {categories.map(c => <SelectItem key={c.id.toString()}>{c.name}</SelectItem>)}
                                    </Select>
                                    <Select label="Type" variant="bordered" selectedKeys={formType} onSelectionChange={(k) => setFormType(k as any)}>
                                        <SelectItem key="ARTICLE">Article</SelectItem><SelectItem key="VIDEO">Vidéo</SelectItem><SelectItem key="JEU">Jeu</SelectItem>
                                    </Select>
                                </div>
                                <Textarea label="Contenu" variant="bordered" minRows={4} value={formContent} onValueChange={setFormContent} />
                            </ModalBody>
                            <ModalFooter className="flex-col sm:flex-row gap-2">
                                <Button variant="light" className="w-full sm:w-auto" onPress={onClose}>Annuler</Button>
                                <Button color="primary" className="w-full sm:w-auto" onPress={handleSaveRes}>Enregistrer</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={isCatOpen} onOpenChange={onCatOpenChange} size="sm" backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-xl font-bold text-[#1B365D]">{editingCatId ? "Modifier" : "Créer"} une catégorie</ModalHeader>
                            <ModalBody>
                                <Input label="Nom" variant="bordered" value={formCatName} onValueChange={setFormCatName} autoFocus />
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>Annuler</Button>
                                <Button color="primary" onPress={handleSaveCat}>Enregistrer</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={isComOpen} onOpenChange={onComOpenChange} size="2xl" scrollBehavior="inside" backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-xl font-bold text-[#1B365D]">Commentaires</ModalHeader>
                            <ModalBody className="gap-4 px-2 md:px-6">
                                {loadingComments ? <div className="flex justify-center p-4"><Spinner /></div> : comments.length === 0 ? <p className="italic text-center py-4">Aucun commentaire.</p> : (
                                    <div className="flex flex-col gap-4">
                                        {comments.filter(c => !c.parentId).map(root => renderCommentNode(root, 0))}
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter><Button variant="light" className="w-full md:w-auto" onPress={onClose}>Fermer</Button></ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={isConfirmOpen} onOpenChange={onConfirmOpenChange} backdrop="blur" size="md">
                <ModalContent className="rounded-2xl">
                    {(onClose) => {
                        const isCat = deleteTarget?.type === "category";
                        const isCom = deleteTarget?.type === "comment";

                        let title = "Suppression de la ressource";
                        let text = "Voulez-vous vraiment supprimer cette ressource définitivement ?";
                        let warning = "Cette action est irréversible.";

                        if (isCat) {
                            title = "Suppression de la catégorie";
                            text = "Voulez-vous vraiment supprimer cette catégorie ?";
                            warning = "Attention : La suppression d'une catégorie peut impacter les ressources qui y sont associées.";
                        } else if (isCom) {
                            title = "Suppression du commentaire";
                            text = "Voulez-vous vraiment supprimer ce commentaire ?";
                            warning = "Ce commentaire ainsi que ses éventuelles réponses seront supprimés de manière irréversible.";
                        }

                        return (
                            <>
                                <ModalHeader className="text-[#1B365D] font-bold flex gap-2 items-center">
                                    <Trash2 size={20} className="text-danger" />
                                    <span className="text-base md:text-lg">{title}</span>
                                </ModalHeader>
                                <ModalBody className="text-gray-600">
                                    <p className="text-sm md:text-base">{text}</p>
                                    <p className="text-xs md:text-sm mt-2 text-danger bg-danger-50 p-3 rounded-lg border border-danger-100">
                                        <strong>Information :</strong> {warning}
                                    </p>
                                </ModalBody>
                                <ModalFooter className="flex-col sm:flex-row gap-2">
                                    <Button variant="light" className="w-full sm:w-auto" onPress={() => { setDeleteTarget(null); onClose(); }}>
                                        Annuler
                                    </Button>
                                    <Button color="danger" className="font-bold w-full sm:w-auto" onPress={confirmDelete}>
                                        Confirmer la suppression
                                    </Button>
                                </ModalFooter>
                            </>
                        );
                    }}
                </ModalContent>
            </Modal>
        </div>
    );
}

/**
 * Documentation du fichier
 *
 * - Role : Gestionnaire admin des ressources et categories. Il charge toutes les ressources, filtre par statut/recherche/categorie et gere les actions de moderation.
 * - Fonctionnement : Il permet valider, suspendre, editer, supprimer les ressources, ainsi que creer/modifier/supprimer des categories.
 * - A retenir : Il integre aussi la lecture et moderation des commentaires associes aux ressources.
 */