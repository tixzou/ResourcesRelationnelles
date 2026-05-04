"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

// Composants HeroUI
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";

// Icônes
import { Calendar, MessageSquare, ArrowLeft, Reply, Trash2, MoreHorizontal, Heart } from "lucide-react";
import Link from "next/link";
import { addToast } from "@heroui/toast";

export default function RessourceDetail() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken;

  const [ressource, setRessource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainComment, setMainComment] = useState("");
  const [replyInput, setReplyInput] = useState("");
  const [replyToId, setReplyToId] = useState<number | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const fetchRessource = useCallback(async () => {
    try {
      const headers: HeadersInit = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:3001/ressource/${id}`, { headers });
      if (!res.ok) throw new Error("Ressource non trouvée");
      const data = await res.json();
      setRessource(data);
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    if (id && status !== "loading") {
      fetchRessource();
    }
  }, [id, status, fetchRessource]);

  const handleToggleFavorite = async () => {
    if (!session || !token) return;

    // Sauvegarde de l'ancien état au cas où l'API échoue
    const previousState = ressource.isFavorited;

    // 1. Mise à jour UI IMMEDIATE (Optimiste)
    setRessource((prev: any) => ({
      ...prev,
      isFavorited: !previousState
    }));

    try {
      const res = await fetch(`http://localhost:3001/ressource/${id}/favorite`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        addToast({
          title: !previousState ? "Ajouté aux favoris" : "Retiré des favoris",
          color: !previousState ? "danger" : "default",
          variant: "flat"
        });
        // NOTE: On ne rappelle PAS fetchRessource() ici pour éviter que l'UI ne "saute"
      } else {
        throw new Error();
      }
    } catch (error) {
      // 2. Rollback si erreur API
      setRessource((prev: any) => ({ ...prev, isFavorited: previousState }));
      addToast({ title: "Erreur lors de la mise à jour", color: "danger" });
    }
  };

  // ... (Garde tes fonctions handlePostComment et handleConfirmDelete identiques) ...

  const handlePostComment = async (content: string, parentId: number | null = null) => {
    if (!content.trim()) return;
    try {
      const res = await fetch(`http://localhost:3001/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content, ressourceId: Number(id), parentId })
      });
      if (res.ok) {
        setMainComment("");
        setReplyInput("");
        setReplyToId(null);
        fetchRessource();
      }
    } catch (error) {}
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;
    try {
      await fetch(`http://localhost:3001/comment/${commentToDelete}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchRessource();
    } finally {
      setCommentToDelete(null);
      onOpenChange();
    }
  };

  if (loading) return <div className="flex justify-center p-24"><Spinner size="lg" /></div>;
  if (!ressource) return <div className="text-center p-24"><p>Ressource introuvable.</p></div>;

  const rootComments = ressource.comments?.filter((c: any) => !c.parentId) || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-[#1B365D] text-white py-14 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <Button as={Link} href="/ressources" variant="light" startContent={<ArrowLeft size={18} />} className="text-white/70 hover:text-white mb-6 p-0 h-auto font-medium">
            Retour au catalogue
          </Button>
          
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-4xl font-bold tracking-tight text-left">{ressource.title}</h1>
            {session && (
              <Button
                isIconOnly
                radius="full"
                variant="flat"
                className="bg-white/10 hover:bg-white/20 border-white/20"
                onPress={handleToggleFavorite}
              >
                <Heart
                  size={24}
                  className={ressource.isFavorited ? "fill-red-500 text-red-500" : "text-white"}
                />
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-blue-100/60 text-sm">
            <span>Par {ressource.author?.firstName} {ressource.author?.lastName}</span>
            <span>•</span>
            <Calendar size={14} />
            <span>{new Date(ressource.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-24 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Card shadow="sm" className="border-none rounded-xl overflow-hidden">
            <CardBody className="p-10 text-gray-700 text-lg leading-relaxed text-left">
              <div className="flex gap-2 mb-8">
                <Chip color="primary" variant="flat" size="sm" className="font-bold px-3 uppercase tracking-wider">{ressource.type}</Chip>
                {ressource.category && <Chip variant="flat" size="sm" className="bg-gray-100 text-gray-500 font-medium px-3">● {ressource.category.name}</Chip>}
              </div>
              {ressource.content}
            </CardBody>
          </Card>

          {/* Section Discussion */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-[#1B365D] flex items-center gap-2">
              <MessageSquare size={22} className="text-blue-500" /> Discussion
            </h2>

            {session && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <Textarea
                  variant="bordered"
                  placeholder="Qu'en pensez-vous ?"
                  value={mainComment}
                  onValueChange={setMainComment}
                  classNames={{ inputWrapper: "border-gray-200 hover:border-blue-300 focus-within:border-blue-400" }}
                />
                <div className="flex justify-end mt-4">
                  <Button color="primary" className="font-bold px-8" onPress={() => handlePostComment(mainComment)}>
                    Publier
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {rootComments.map((root: any) => {
                const isMyComment = session && Number((session as any).user?.id) === Number(root.authorId);
                return (
                  <div key={root.id} className="space-y-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={root.author?.firstName} size="sm" className="bg-[#1B365D] text-white font-bold" />
                          <div>
                            <p className="font-bold text-sm text-[#1B365D]">{root.author?.firstName} {root.author?.lastName}</p>
                            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tighter">{new Date(root.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {isMyComment && (
                          <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                              <Button isIconOnly size="sm" variant="light" className="text-gray-400"><MoreHorizontal size={18} /></Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Actions">
                              <DropdownItem key="delete" color="danger" className="text-danger" startContent={<Trash2 size={16} />} onPress={() => { setCommentToDelete(root.id); onOpen(); }}>
                                Supprimer
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      </div>
                      <p className="text-[15px] text-gray-700 leading-normal mb-5">{root.content}</p>
                      <Button size="sm" variant="light" startContent={<Reply size={14} />} className="text-gray-500 font-bold hover:text-blue-600 px-0 h-auto" onPress={() => setReplyToId(replyToId === root.id ? null : root.id)}>
                        Répondre
                      </Button>
                      {replyToId === root.id && (
                        <div className="mt-5 pt-5 border-t border-gray-50 space-y-3">
                          <Textarea autoFocus variant="bordered" placeholder={`Répondre à ${root.author?.firstName}...`} value={replyInput} onValueChange={setReplyInput} />
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="light" onPress={() => setReplyToId(null)}>Annuler</Button>
                            <Button size="sm" color="primary" className="font-bold" onPress={() => handlePostComment(replyInput, root.id)}>Répondre</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <Card shadow="sm" className="border-none rounded-xl overflow-hidden">
            <div className="bg-[#1B365D] p-4 text-white font-bold text-xs uppercase tracking-widest text-center">Informations</div>
            <CardBody className="p-8 space-y-6 text-left">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-[#1B365D]"><Calendar size={20} /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Publication</p>
                  <p className="text-sm font-bold text-[#1B365D]">{new Date(ressource.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <Divider className="opacity-50" />
              <div className="flex items-center gap-4">
                <Avatar isBordered color="primary" name={ressource.author?.firstName} size="md" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Auteur</p>
                  <p className="text-sm font-bold text-[#1B365D]">{ressource.author?.firstName} {ressource.author?.lastName}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </aside>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent className="rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="text-[#1B365D] font-bold">Suppression du contenu</ModalHeader>
              <ModalBody className="text-gray-600">Confirmer la suppression ?</ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Annuler</Button>
                <Button color="danger" className="font-bold" onPress={handleConfirmDelete}>Supprimer</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}