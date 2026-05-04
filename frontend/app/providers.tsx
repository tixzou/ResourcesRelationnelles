"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <SessionProvider>

        <NextThemesProvider
          {...themeProps}
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
        >
          {children}
        </NextThemesProvider>
      </SessionProvider>
    </HeroUIProvider>
  );
}

/**
 * Documentation du fichier
 *
 * - Role : Composant client qui installe les providers globaux de l'application frontend.
 * - Fonctionnement : Il branche HeroUI pour la navigation, NextAuth pour la session et NextThemes pour la gestion du theme.
 * - A retenir : Le theme est force en clair, ce qui stabilise l'apparence meme si le switch de theme existe encore.
 */
