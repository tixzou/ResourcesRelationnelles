import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/**
 * Documentation du fichier
 *
 * - Role : Fichier de types partages du frontend. Il definit IconSvgProps pour les composants SVG.
 * - Fonctionnement : Le type ajoute une prop size aux props standard SVG de React.
 * - A retenir : Il evite de repeter la meme definition dans chaque icone.
 */
