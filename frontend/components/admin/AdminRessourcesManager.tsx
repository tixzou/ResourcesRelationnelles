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

    // Filtres
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    // --- ÉTATS MODALE RESSOURCE ---
    const { isOpen: isResOpen, onOpen: onResOpen, onOpenChange: onResOpenChange, onClose: onResClose } = useDisclosure();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formType, setFormType] = useState(new Set(["ARTICLE"]));
    const [formCategoryId, setFormCategoryId] = useState(new Set<string>([]));

    // --- ÉTATS MODALE CATÉGORIE ---
    const { isOpen: isCatOpen, onOpen: onCatOpen, onOpenChange: onCatOpenChange, onClose: onCatClose } = useDisclosure();
    const [editingCatId, setEditingCatId] = useState<number | null>(null);
    const [formCatName, setFormCatName] = useState("");

    // --- ÉTATS MODALE COMMENTAIRES ---
    const { isOpen: isComOpen, onOpen: onComOpen, onOpenChange: onComOpenChange, onClose: onComClose } = useDisclosure();
    const [activeResId, setActiveResId] = useState<number | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [replyingToId, setReplyingToId] = useState<number | null>(null);
    const [replyText, setReplyText] = useState("");

    // Droits élevés (Admin / Super Admin)
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

    // --- ACTIONS ---
    const handleAction = async (id: number, action: "validate" | "suspend" | "delete") => {
        if (action === "delete" && !confirm("Voulez-vous vraiment effectuer cette action ?")) return;
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

    // =========================================================================
    // --- GESTION DES COMMENTAIRES ---
    // =========================================================================

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
        if (!confirm("Voulez-vous vraiment supprimer ce commentaire ?")) return;
        try {
            const res = await fetch(`http://localhost:3001/admin/comments/${commentId}`, {
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
            <div key={comment.id} className={isRoot ? "bg-gray-50 p-4 rounded-xl border border-gray-100" : "ml-6 mt-3 p-3 bg-white border border-gray-100 rounded-lg"}>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className={`font-bold ${isRoot ? 'text-sm' : 'text-xs'} text-[#1B365D]`}>
                            {comment.author?.firstName} {comment.author?.lastName}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                            {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                    </div>
                    <div className="flex gap-1 items-center">
                        <Button size="sm" variant="light" color="primary" className="h-6 min-w-0 px-2 text-[11px]" onPress={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}>
                            Répondre
                        </Button>
                        <Button size="sm" isIconOnly variant="light" color="danger" className="h-6 w-6 min-w-0" onPress={() => handleDeleteComment(comment.id)} title="Supprimer">
                            <Trash2 size={14}/>
                        </Button>
                    </div>
                </div>
                
                <p className={`${isRoot ? 'text-sm text-gray-700' : 'text-sm text-gray-600'}`}>{comment.content}</p>

                {replyingToId === comment.id && (
                    <div className="mt-3 flex gap-2">
                        <Input 
                            size="sm" 
                            variant="bordered" 
                            placeholder="Répondre..." 
                            value={replyText} 
                            onValueChange={setReplyText} 
                            autoFocus
                        />
                        <Button size="sm" color="primary" className="bg-[#1B365D]" onPress={() => handlePostReply(comment.id)}>
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

    // =========================================================================
    // --- GESTION DES CATÉGORIES ---
    // =========================================================================

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
        if (!confirm("Attention, la suppression d'une catégorie peut impacter les ressources associées. Continuer ?")) return;
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

    // RENDU LIGNE RESSOURCE
    const renderResListItem = (r: any, isPending: boolean) => (
        <div key={r.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all gap-4">
            <div className="flex flex-col gap-1 w-full md:w-2/3">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#1B365D] line-clamp-1">{r.title}</h3>
                    <Chip size="sm" variant="flat" color={isPending ? "warning" : "success"} className="text-[10px] font-bold h-5 px-1 shrink-0">
                        {isPending ? "EN ATTENTE" : "PUBLIÉE"}
                    </Chip>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">Par <span className="font-semibold text-gray-700">{r.author.firstName} {r.author.lastName}</span></span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</span>
                    <span className="text-gray-300">•</span>
                    <Chip size="sm" variant="flat" className="bg-gray-100 border border-gray-200 text-gray-600 text-[10px] h-5">{r.type}</Chip>
                    {r.category && <Chip size="sm" variant="dot" color="secondary" className="border-none text-gray-500 text-[10px] h-5">{r.category.name}</Chip>}
                </div>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
                {/* COMMENTAIRES : Visible par tous */}
                <Button isIconOnly variant="flat" color="primary" size="sm" onPress={() => handleOpenComments(r.id)} title="Commentaires">
                    <MessageSquare size={16} />
                </Button>
                
                {/* ÉDITION : Réservé Admin */}
                {isAdmin && (
                    <Button isIconOnly variant="flat" color="default" size="sm" onPress={() => {
                        setEditingId(r.id); setFormTitle(r.title); setFormContent(r.content || ""); 
                        setFormType(new Set([r.type])); setFormCategoryId(new Set([r.categoryId?.toString() || ""]));
                        onResOpen();
                    }}><Edit size={16} /></Button>
                )}

                {isPending ? (
                    <>
                        <Button isIconOnly color="danger" variant="flat" size="sm" onPress={() => handleAction(r.id, "delete")} title="Rejeter"><XCircle size={16} /></Button>
                        <Button color="success" size="sm" className="text-white font-medium" startContent={<CheckCircle size={16} />} onPress={() => handleAction(r.id, "validate")}>Approuver</Button>
                    </>
                ) : (
                    <>
                        {/* SUSPENDRE : Désormais réservé à l'ADMIN uniquement */}
                        {isAdmin && (
                            <Button color="warning" size="sm" variant="flat" startContent={<Ban size={16} />} onPress={() => handleAction(r.id, "suspend")}>
                                Suspendre
                            </Button>
                        )}
                        
                        {/* SUPPRIMER : Réservé Admin */}
                        {isAdmin && (
                            <Button isIconOnly color="danger" size="sm" variant="light" onPress={() => handleAction(r.id, "delete")}><Trash2 size={16} /></Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className="w-full flex flex-col gap-6">
            
            {selectedTab !== "categories" && (
                <div className="flex flex-col md:flex-row gap-4 items-center w-full">
                    <Input value={search} onValueChange={setSearch} className="w-full md:flex-1" placeholder="Rechercher..." startContent={<Search size={20} className="text-gray-400" />} variant="bordered" />
                    <div className="flex w-full md:w-auto gap-3">
                        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="flex-1 md:w-48 bg-white border border-gray-200 rounded-xl px-4 h-10 text-sm outline-none cursor-pointer">
                            <option value="">Toutes catégories</option>
                            {categories.map((cat) => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
                        </select>
                        <Button variant="flat" className="h-10 bg-gray-100" onPress={() => { setSearch(""); setCategoryFilter(""); }}>Reset</Button>
                        
                        {isAdmin && (
                            <Button color="primary" className="h-10 bg-[#1B365D]" startContent={<Plus size={18} />} onPress={() => {
                                setEditingId(null); setFormTitle(""); setFormContent(""); setFormType(new Set(["ARTICLE"])); setFormCategoryId(new Set([]));
                                onResOpen();
                            }}>Créer</Button>
                        )}
                    </div>
                </div>
            )}

            <Tabs selectedKey={selectedTab} onSelectionChange={(k) => setSelectedTab(k as string)} variant="underlined" color="primary" classNames={{ tabList: "gap-6 w-full border-b border-gray-200 p-0", cursor: "bg-[#1B365D]", tabContent: "group-data-[selected=true]:text-[#1B365D] font-bold" }}>
                <Tab key="pending" title={<div className="flex items-center gap-2">À vérifier <Chip size="sm" color="warning" className="text-white border-none">{pendingRessources.length}</Chip></div>}>
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
                    <Tab key="categories" title={<div className="flex items-center gap-2"><FolderTree size={16}/> Catégories</div>}>
                        <div className="pt-4 flex flex-col gap-4">
                            <div className="flex justify-end mb-2">
                                <Button color="primary" className="bg-[#1B365D]" startContent={<Plus size={18} />} onPress={() => {
                                    setEditingCatId(null); setFormCatName(""); onCatOpen();
                                }}>Nouvelle catégorie</Button>
                            </div>
                            {categories.map(cat => (
                                <div key={cat.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                                    <span className="font-bold text-[#1B365D]">{cat.name}</span>
                                    <div className="flex gap-2">
                                        <Button isIconOnly variant="flat" size="sm" onPress={() => {
                                            setEditingCatId(cat.id); setFormCatName(cat.name); onCatOpen();
                                        }}><Edit size={16} /></Button>
                                        <Button isIconOnly color="danger" variant="light" size="sm" onPress={() => handleDeleteCat(cat.id)}><Trash2 size={16} /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Tab>
                )}
            </Tabs>

            {/* MODALE RESSOURCE */}
            <Modal isOpen={isResOpen} onOpenChange={onResOpenChange} size="lg" backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-xl font-bold text-[#1B365D]">{editingId ? "Modifier" : "Créer"} une ressource</ModalHeader>
                            <ModalBody className="gap-4">
                                <Input label="Titre" variant="bordered" value={formTitle} onValueChange={setFormTitle} />
                                <div className="flex gap-4">
                                    <Select label="Catégorie" variant="bordered" selectedKeys={formCategoryId} onSelectionChange={(k) => setFormCategoryId(k as any)}>
                                        {categories.map(c => <SelectItem key={c.id.toString()}>{c.name}</SelectItem>)}
                                    </Select>
                                    <Select label="Type" variant="bordered" selectedKeys={formType} onSelectionChange={(k) => setFormType(k as any)}>
                                        <SelectItem key="ARTICLE">Article</SelectItem><SelectItem key="VIDEO">Vidéo</SelectItem><SelectItem key="JEU">Jeu</SelectItem>
                                    </Select>
                                </div>
                                <Textarea label="Contenu" variant="bordered" minRows={4} value={formContent} onValueChange={setFormContent} />
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>Annuler</Button>
                                <Button color="primary" onPress={handleSaveRes}>Enregistrer</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* MODALE CATÉGORIE */}
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

            {/* MODALE COMMENTAIRES */}
            <Modal isOpen={isComOpen} onOpenChange={onComOpenChange} size="2xl" scrollBehavior="inside" backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-xl font-bold text-[#1B365D]">Commentaires</ModalHeader>
                            <ModalBody className="gap-4">
                                {loadingComments ? <Spinner /> : comments.length === 0 ? <p className="italic text-center">Aucun commentaire.</p> : (
                                    <div className="flex flex-col gap-4">
                                        {comments.filter(c => !c.parentId).map(root => renderCommentNode(root, 0))}
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter><Button variant="light" onPress={onClose}>Fermer</Button></ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}