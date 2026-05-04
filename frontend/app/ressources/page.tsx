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