"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import Image from "next/image";
import AuthModal from "./authentification/authModal";

export default function NavbarComponent() {
  return (
    <Navbar shouldHideOnScroll className="border-b-1 border-[#003E7E]">
      <NavbarBrand>
        <Image
          src="/favicon.ico"
          width={50}
          height={50}
          alt="Logo de (RE)Sources Relationnelles"
          className="w-10 h-auto object-contain opacity-80"
        />
        <Link href="/">
        <p className="font-bold text-inherit">
          (RE)Sources <span className="text-[#003E7E]">Relationnelles</span>
        </p>
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <Link color="foreground" href="/ressources" className="hover:text-[#003E7E]">
            Ressources
          </Link>
        </NavbarItem>
        <span className="text-gray-500">|</span>
        <NavbarItem>
          <AuthModal />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
