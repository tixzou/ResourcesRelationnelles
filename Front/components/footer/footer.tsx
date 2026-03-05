"use client";

import { Link } from "@heroui/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t-1 border-[#003E7E] bg-white py-2">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Image
            src="/favicon.ico"
            width={50}
            height={50}
            alt="Logo (RE)Sources Relationnelles"
            className="w-8 h-auto object-contain opacity-80"
          />
          <p className="font-semibold text-black text-sm sm:text-base">
            (RE)Sources <span className="text-[#003E7E]">Relationnelles</span>
          </p>
        </div>

        <div className="flex gap-6 text-sm text-gray-500">
          <Link href="#" color="foreground" className="hover:text-[#003E7E] text-xs sm:text-sm">
            CGU
          </Link>
          <Link href="#" color="foreground" className="hover:text-[#003E7E] text-xs sm:text-sm">
            Confidentialité
          </Link>
          <Link href="#" color="foreground" className="hover:text-[#003E7E] text-xs sm:text-sm">
            Contact
          </Link>
        </div>

        <p className="text-tiny text-gray-400 mt-2">
          © {currentYear} (RE)Sources Relationnelles. Tous droits réservés.
        </p>
        
      </div>
    </footer>
  );
}