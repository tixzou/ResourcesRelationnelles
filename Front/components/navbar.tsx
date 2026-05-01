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
import { useState, useEffect } from "react";
import { Button } from "@heroui/button";

export default function NavbarComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("app_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    setUserName(null);
    window.location.reload();
  };
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
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        />
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

      <NavbarContent justify="end" className="gap-4">
        <NavbarItem className="hidden sm:flex">
          <Link color="foreground" href="/" className="hover:text-[#003E7E]">
            Accueil
          </Link>
        </NavbarItem>

        <NavbarItem className="hidden sm:flex">
          <Link
            color="foreground"
            href="/ressources"
            className="hover:text-[#003E7E]"
          >
            Ressources
          </Link>
        </NavbarItem>

        <span className="text-gray-500 hidden sm:flex">|</span>

        <NavbarItem className="hidden sm:flex">
          {userName ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[#003E7E]">
                Bonjour, <strong>{userName}</strong>
              </span>
              <Button
                size="sm"
                variant="flat"
                color="danger"
                onPress={handleLogout}
                className="text-tiny"
              >
                Déconnexion
              </Button>
            </div>
          ) : (
            <AuthModal />
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="pt-6">
        <NavbarMenuItem>
          <Link
            color="foreground"
            className="w-full text-lg py-2"
            href="/"
            onPress={() => setIsMenuOpen(false)}
          >
            Accueil
          </Link>
          <Link
            color="foreground"
            className="w-full text-lg py-2"
            href="/ressources"
            onPress={() => setIsMenuOpen(false)}
          >
            Ressources
          </Link>
        </NavbarMenuItem>

        <NavbarMenuItem>
          <div className="pt-4 border-t border-gray-100">
            <AuthModal />
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
