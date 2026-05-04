import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

/**
 * Documentation du fichier
 *
 * - Role : Configuration des polices via next/font. Elle expose une police sans serif et une police monospace.
 * - Fonctionnement : Ces exports sont utilises dans le layout racine pour appliquer les classes de police.
 * - A retenir : Le fichier garde la configuration typographique separee du layout.
 */
