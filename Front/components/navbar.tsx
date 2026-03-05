import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import Image from "next/image";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

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
        <p className="font-bold text-inherit">
          (RE)Sources <span className="text-[#003E7E]">Relationnelles</span>
        </p>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <Link color="foreground" href="#">
            Ressources
          </Link>
        </NavbarItem>
        <span className="text-gray-500">|</span>
        <NavbarItem>
          <Button as={Link} className="hover:bg-[#003E7E] hover:text-white text-[#003E7E]" href="#" variant="flat">
            Se connecter
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
