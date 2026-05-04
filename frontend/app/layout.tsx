import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { ToastProvider } from "@heroui/toast";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import NavbarComponent from "@/components/navbar";
import Footer from "@/components/footer/footer";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "white" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="fr" className="light text-foreground bg-background">
      <head />
      <body
        className={clsx(
          "min-h-screen font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light", forcedTheme: "light" }}>
          <ToastProvider />
          <div className="relative flex flex-col h-screen">
            <NavbarComponent />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
             <Footer/>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}

/**
 * Documentation du fichier
 *
 * - Role : Layout racine Next.js. Il charge les styles globaux, les polices, les metadata et le viewport.
 * - Fonctionnement : Il entoure toutes les pages avec les providers, la navbar, le ToastProvider pour les notifications globales, le contenu principal et le footer.
 * - A retenir : C'est le point commun de l'interface : toute modification ici impacte l'ensemble du frontend. L'ajout du ToastProvider est indispensable pour afficher les alertes (succes, erreurs) generees par addToast.
 */