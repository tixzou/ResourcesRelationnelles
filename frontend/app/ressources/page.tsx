"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { useSession } from "next-auth/react";
import ResourcesHeader from "@/components/ressources/ResourcesHeader";
import PublicResourcesList from "@/components/ressources/PublicResourcesList";
import MyResourcesManager from "@/components/ressources/MyResourcesManager";

export default function ResourcesPage() {
  const { data: session, status } = useSession();
  const [selectedTab, setSelectedTab] = useState("catalogue");

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      <ResourcesHeader />
    </div>
  );
}

/**
 * Documentation du fichier
 *
 * - Role : Page catalogue des ressources. Elle gere l'etat de l'onglet actif et recupere la session utilisateur pour adapter l'interface.
 * - Fonctionnement : Elle affiche les vues publiques ou personnelles selon l'onglet selectionne et l'etat de connexion.
 * - A retenir : Elle sert de conteneur leger autour des composants metier de ressources.
 */
