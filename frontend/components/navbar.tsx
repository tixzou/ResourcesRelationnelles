"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import Image from "next/image";
import AuthModal from "./authentification/authModal";
import { useState } from "react";
import { Button } from "@heroui/button";
import { useSession, signOut } from "next-auth/react";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavbarComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { data: session } = useSession();

 const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const userRole = (session?.user as any)?.role;
  const isAdminOrMod = userRole === "ADMINISTRATEUR" || userRole === "MODERATEUR" || userRole === "SUPER_ADMINISTRATEUR";

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      disableAnimation={false}
      isBordered
      shouldHideOnScroll
      className="border-b-1 border-[#003E7E]"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"} />
      </NavbarContent>

      <NavbarBrand className="gap-2">
        <Image
          src="/ministere.png"
          width={500}
          height={500}
          alt="Logo du Ministère de la Santé et de la Prévention"
          className="w-24 h-auto object-contain hidden sm:inline"
        />
        <Image
          src="/favicon.ico"
          width={50}
          height={50}
          alt="Logo (RE)Sources Relationnelles"
          className="w-16 h-auto object-contain hidden sm:inline"
        />
        <Link href="/" className="flex items-center">
          <p className="font-semibold text-black xs:text-base">
            (RE)Sources <span className="text-[#003E7E]">Relationnelles</span>
          </p>
        </Link>
      </NavbarBrand>

      {/* --- AFFICHAGE ORDINATEUR (DESKTOP) --- */}
      <NavbarContent justify="end" className="gap-4">
        <NavbarItem className="hidden sm:flex">
          <Link color="foreground" href="/" className="hover:text-[#003E7E] text-sm font-medium">Accueil</Link>
        </NavbarItem>

        <NavbarItem className="hidden sm:flex">
          <Link color="foreground" href="/ressources" className="hover:text-[#003E7E] text-sm font-medium">Ressources</Link>
        </NavbarItem>

        {/* Bouton Admin version compacte pour le Desktop */}
        {isAdminOrMod && (
          <NavbarItem className="hidden sm:flex">
            <Link
              href="/administrateur"
              className="flex items-center gap-2 bg-blue-50/80 hover:bg-blue-100 text-[#1B365D] px-3 py-1.5 rounded-lg font-bold transition-all border border-blue-100 text-sm"
            >
              <Shield size={16} className="text-blue-600" />
              Espace Admin
            </Link>
          </NavbarItem>
        )}

        <span className="text-gray-300 hidden sm:flex">|</span>

        <NavbarItem className="hidden sm:flex">
          {session?.user?.name ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="text-sm font-bold text-[#1B365D] hover:text-blue-600 transition-colors">
                Mon compte
              </Link>
              <Button size="sm" variant="flat" color="danger" onPress={handleLogout} className="text-tiny font-bold">
                Déconnexion
              </Button>
            </div>
          ) : (
            <AuthModal />
          )}
        </NavbarItem>
      </NavbarContent>

      {/* --- AFFICHAGE MOBILE (MENU BURGER) --- */}
      <NavbarMenu className="pt-6 gap-4">
        <NavbarMenuItem className="flex flex-col gap-2">
          <Link color="foreground" className="w-full text-lg py-2" href="/" onPress={() => setIsMenuOpen(false)}>
            Accueil
          </Link>
          <Link color="foreground" className="w-full text-lg py-2" href="/ressources" onPress={() => setIsMenuOpen(false)}>
            Ressources
          </Link>

          {/* Bouton Admin version large pour le Mobile */}
          {isAdminOrMod && (
            <Link
              href="/administrateur"
              onPress={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 w-full text-lg py-3 px-4 mt-2 bg-blue-50/80 hover:bg-blue-100 text-[#1B365D] rounded-xl font-bold transition-all border border-blue-100"
            >
              <Shield size={20} className="text-blue-600" />
              Espace Admin
            </Link>
          )}
        </NavbarMenuItem>

        <NavbarMenuItem>
          <div className="pt-6 mt-2 border-t border-gray-100">
            {session?.user?.name ? (
              <div className="flex flex-col gap-4">
                <span className="text-base text-gray-600 text-center">
                  Connecté en tant que <strong>{session?.user?.name}</strong>
                </span>
                <Button className="w-full font-bold" color="danger" variant="flat" size="lg" onPress={handleLogout}>
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <AuthModal />
              </div>
            )}
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}

/**
 * Documentation du fichier
 *
 * - Role : Barre de navigation globale. Elle gere le menu mobile, l'affichage connecte/deconnecte et la deconnexion NextAuth.
 * - Fonctionnement : Elle affiche un acces administration si le role est moderateur, administrateur ou super administrateur.
 * - A retenir : Elle integre AuthModal pour ouvrir les formulaires de connexion et inscription.
 */