"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { useSession } from "next-auth/react";
import ResourcesHeader from "@/components/ressources/ResourcesHeader";
import PublicResourcesList from "@/components/ressources/PublicResourcesList.tsx"; 
import MyResourcesManager from "@/components/ressources/MyResourcesManager"; 

export default function ResourcesPage() {
  const { data: session, status } = useSession();
  const [selectedTab, setSelectedTab] = useState("catalogue");

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      <ResourcesHeader />

      <main className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-8">
        <Tabs
          aria-label="Options de ressources"
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          color="primary"
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-[#1B365D]",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-[#1B365D] font-semibold text-base"
          }}
        >
          {/* <Tab key="catalogue" title="Catalogue public">
            <div className="pt-8">
              <PublicResourcesList />
            </div>
          </Tab> */}

            {/* Onglet visible uniquement si l'utilisateur est connecté */}
            {/* 
              status === "authenticated" && (
                <Tab key="mes-ressources" title="Mes ressources">
                  <div className="pt-8">
                    <MyResourcesManager token={(session as any)?.accessToken} />
                  </div>
                </Tab>
              )
            */}
        </Tabs>
      </main>
    </div>
  );
}