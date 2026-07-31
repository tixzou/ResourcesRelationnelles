"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Video, Gamepad2, Users, Target, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-gray-50">
      {/* --- SECTION HERO --- */}
      <section className="bg-[#1B365D] w-full py-12 md:py-20 px-6 sm:px-12 lg:px-24 relative overflow-hidden">
        {/* Décoration d'arrière-plan subtile */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex flex-col gap-6 items-start text-left">
            <h1 className="text-white text-3xl sm:text-5xl font-bold leading-tight">
              Construisons ensemble la <span className="text-[#FF7A00]">qualité</span> de nos relations
            </h1>

            <p className="text-blue-100 text-base sm:text-lg max-w-xl leading-relaxed">
              (RE)Sources Relationnelles est votre plateforme institutionnelle dédiée à l&apos;épanouissement humain. 
              Accédez à des centaines de contenus pour mieux communiquer, comprendre et grandir.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <Link href="/ressources">
                <Button
                  className="bg-[#FF7A00] text-white font-bold px-8 h-12 rounded-xl shadow-lg hover:scale-105 transition-transform"
                  endContent={<span>→</span>}
                >
                  Découvrir les ressources
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="bordered"
                  className="text-white border-white/30 px-8 h-12 rounded-xl hover:bg-white/10"
                >
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative w-full h-64 sm:h-80 md:h-[400px] hidden md:block">
            <Image
              src="/group-people-from.jpg"
              alt="Groupe de personnes collaborant"
              fill
              className="object-cover rounded-3xl shadow-2xl border-4 border-white/10"
              priority
            />
          </div>
        </div>
      </section>

      {/* --- SECTION CHIFFRES CLÉS (Réassurance) --- */}
      <section className="py-12 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Ressources", val: "500+", color: "text-[#1B365D]" },
            { label: "Utilisateurs", val: "10k+", color: "text-[#FF7A00]" },
            { label: "Experts", val: "50+", color: "text-[#1B365D]" },
            { label: "Catégories", val: "12", color: "text-[#FF7A00]" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className={`text-2xl md:text-4xl font-black ${stat.color}`}>{stat.val}</p>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION FORMATS DE CONTENU --- */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-[#1B365D] text-2xl md:text-3xl font-bold mb-4">Des formats adaptés à vos besoins</h2>
          <div className="w-20 h-1 bg-[#FF7A00] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card shadow="sm" className="border-none bg-white hover:shadow-md transition-shadow">
            <CardBody className="p-6 flex flex-col gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-[#1B365D]">
                <BookOpen size={28} />
              </div>
              <h3 className="font-bold text-lg text-[#1B365D]">Articles & Fiches</h3>
              <p className="text-gray-600 text-sm">Des lectures approfondies pour comprendre les mécanismes relationnels au quotidien.</p>
            </CardBody>
          </Card>

          <Card shadow="sm" className="border-none bg-white hover:shadow-md transition-shadow">
            <CardBody className="p-6 flex flex-col gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-[#FF7A00]">
                <Video size={28} />
              </div>
              <h3 className="font-bold text-lg text-[#1B365D]">Vidéos pédagogiques</h3>
              <p className="text-gray-600 text-sm">Des experts vous livrent leurs conseils en format vidéo court et impactant.</p>
            </CardBody>
          </Card>

          <Card shadow="sm" className="border-none bg-white hover:shadow-md transition-shadow">
            <CardBody className="p-6 flex flex-col gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                <Gamepad2 size={28} />
              </div>
              <h3 className="font-bold text-lg text-[#1B365D]">Activités ludiques</h3>
              <p className="text-gray-600 text-sm">Apprenez par le jeu avec des exercices interactifs et des mises en situation.</p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* --- SECTION VALEURS --- */}
      <section className="bg-gray-100 py-16 px-6 sm:px-12 lg:px-24 w-full">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-[#1B365D] text-2xl md:text-3xl font-bold mb-6">Pourquoi utiliser (RE)Sources Relationnelles ?</h2>
            <div className="space-y-6">
              {[
                { icon: <Users />, title: "Communauté engagée", text: "Échangez et partagez vos expériences avec d'autres membres." },
                { icon: <Target />, title: "Objectifs concrets", text: "Des outils pratiques applicables immédiatement dans votre vie." },
                { icon: <ShieldCheck />, title: "Contenu certifié", text: "Toutes nos ressources sont validées par des professionnels." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-[#FF7A00] shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-[#1B365D]">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 w-full h-64 bg-gray-300 rounded-3xl overflow-hidden relative shadow-xl">
             <div className="absolute inset-0 flex items-center justify-center bg-[#1B365D]/10 text-[#1B365D] font-medium p-8 text-center italic">
                &quot;La qualité de notre vie dépend de la qualité de nos relations.&quot;
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Documentation du fichier
 *
 * - Role : Page d'accueil enrichie de l'application. Elle présente la proposition de valeur complète.
 * - Fonctionnement : Structurée en sections (Hero, Stats, Formats, Valeurs, CTA) pour guider l'utilisateur.
 * - Design : Respecte la charte (Bleu #1B365D, Orange #FF7A00) avec l'ajout de cartes et d'icônes Lucide.
 * - Responsive : Entièrement adaptative du mobile au desktop.
 */