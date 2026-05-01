"use client";

import { useEffect, useState } from "react";
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
import { Calendar, MessageSquare, ArrowLeft, Reply, X, Trash2, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default function RessourceDetail() {
  const { id } = useParams();
  const { data: session } = useSession();
  
  const [ressource, setRessource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainComment, setMainComment] = useState("");
  const [replyInput, setReplyInput] = useState("");
  const [replyToId, setReplyToId] = useState<number | null>(null);
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const fetchRessource = async () => {
    try {
      const res = await fetch(`http://localhost:3001/ressource/${id}`);
      if (!res.ok) throw new Error("Ressource non trouvée");
      const data = await res.json();
      setRessource(data);
    } catch (error) {
      console.error("Erreur chargement:", error);
      setRessource(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchRessource(); }, [id]);

  const handlePostComment = async (content: string, parentId: number | null = null) => {
    if (!content.trim()) return;
    try {
      const res = await fetch(`http://localhost:3001/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(session as any)?.accessToken}`
        },
        body: JSON.stringify({ content, ressourceId: Number(id), parentId })
      });

      if (res.ok) {
        setMainComment("");
        setReplyInput("");
        setReplyToId(null);
        fetchRessource();
      }
    } catch (error) {
      console.error("Erreur post commentaire:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;
    try {
      await fetch(`http://localhost:3001/comment/${commentToDelete}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${(session as any)?.accessToken}` }
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
      {/* Header DA - Bleu Marine profond */}
      <div className="bg-[#1B365D] text-white py-14 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <Button as={Link} href="/ressources" variant="light" startContent={<ArrowLeft size={18}/>} className="text-white/70 hover:text-white mb-6 p-0 h-auto font-medium">
            Retour au catalogue
          </Button>
          <h1 className="text-4xl font-bold mb-3 tracking-tight">{ressource.title}</h1>
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
          
          {/* Contenu Article */}
          <Card shadow="sm" className="border-none rounded-xl overflow-hidden">
            <CardBody className="p-10 text-gray-700 text-lg leading-relaxed">
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

            {/* Nouveau commentaire principal */}
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

            {/* Liste des messages */}
            <div className="space-y-8">
              {rootComments.map((root: any) => {
                const isMyComment = session && Number((session as any).user?.id) === Number(root.authorId);
                
                return (
                  <div key={root.id} className="space-y-4">
                    {/* --- BULLE RACINE --- */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
                      
                      <Button 
                        size="sm" variant="light" 
                        startContent={<Reply size={14}/>} 
                        className="text-gray-500 font-bold hover:text-blue-600 px-0 h-auto"
                        onPress={() => setReplyToId(replyToId === root.id ? null : root.id)}
                      >
                        Répondre
                      </Button>

                      {/* Textarea de réponse sous Racine */}
                      {replyToId === root.id && (
                        <div className="mt-5 pt-5 border-t border-gray-50 space-y-3">
                          <Textarea
                            autoFocus
                            variant="bordered"
                            placeholder={`Répondre à ${root.author?.firstName}...`}
                            value={replyInput}
                            onValueChange={setReplyInput}
                          />
                          <div className="flex justify-end gap-2">
                             <Button size="sm" variant="light" onPress={() => setReplyToId(null)}>Annuler</Button>
                             <Button size="sm" color="primary" className="font-bold" onPress={() => handlePostComment(replyInput, root.id)}>Répondre</Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* --- RÉPONSES (THREAD) --- */}
                    {ressource.comments?.filter((r: any) => r.parentId === root.id).map((reply: any) => {
                      const isMyReply = session && Number((session as any).user?.id) === Number(reply.authorId);
                      return (
                        <div key={reply.id} className="ml-10 bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <Avatar name={reply.author?.firstName} size="sm" className="bg-gray-200 text-gray-600 font-bold" />
                                <div>
                                    <p className="font-bold text-xs text-[#1B365D]">{reply.author?.firstName} {reply.author?.lastName}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{new Date(reply.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            
                            {/* Menu d'options pour les RÉPONSES (Nouveauté) */}
                            {isMyReply && (
                              <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                  <Button isIconOnly size="sm" variant="light" className="text-gray-400 h-8 w-8"><MoreHorizontal size={16} /></Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Actions">
                                  <DropdownItem key="delete" color="danger" className="text-danger" startContent={<Trash2 size={16} />} onPress={() => { setCommentToDelete(reply.id); onOpen(); }}>
                                    Supprimer
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            )}
                          </div>

                          <p className="text-sm text-gray-700">{reply.content}</p>

                          <Button 
                            size="sm" variant="light" 
                            startContent={<Reply size={14}/>} 
                            className="text-gray-500 font-bold hover:text-blue-600 px-0 h-auto"
                            onPress={() => setReplyToId(replyToId === reply.id ? null : reply.id)}
                          >
                            Répondre
                          </Button>

                          {/* Textarea de réponse sous une Réponse */}
                          {replyToId === reply.id && (
                            <div className="mt-4 pt-4 border-t border-gray-50 space-y-3">
                              <Textarea
                                autoFocus
                                variant="bordered"
                                placeholder={`Répondre à ${reply.author?.firstName}...`}
                                value={replyInput}
                                onValueChange={setReplyInput}
                              />
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="light" onPress={() => setReplyToId(null)}>Annuler</Button>
                                <Button size="sm" color="primary" className="font-bold" onPress={() => handlePostComment(replyInput, root.id)}>Répondre</Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar Sidebar - Style Pro */}
        <aside className="space-y-6">
          <Card shadow="sm" className="border-none rounded-xl overflow-hidden">
            <div className="bg-[#1B365D] p-4 text-white font-bold text-xs uppercase tracking-widest text-center">Informations</div>
            <CardBody className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-[#1B365D]"><Calendar size={20}/></div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Publication</p>
                        <p className="text-sm font-bold text-[#1B365D]">{new Date(ressource.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <Divider className="opacity-50" />
                <div className="flex items-center gap-4">
                    <Avatar isBordered color="primary" name={ressource.author?.firstName} size="md" className="ring-[#1B365D]/10" />
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Expert / Auteur</p>
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
              <ModalBody className="text-gray-600">Cette action retirera définitivement votre message de cette discussion. Confirmer ?</ModalBody>
              <ModalFooter>
                <Button variant="light" className="font-medium" onPress={onClose}>Annuler</Button>
                <Button color="danger" className="font-bold px-6" onPress={handleConfirmDelete}>Oui, supprimer</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}