import { title } from "@/components/primitives";

export default function AboutPage() {
  return (
    <div>
      <h1 className={title()}>About</h1>
    </div>
  );
}

/**
 * Documentation du fichier
 *
 * - Role : Page About issue du template frontend. Elle affiche un titre simple via les primitives typographiques.
 * - Fonctionnement : Elle ne contient pas encore de contenu metier specifique au projet.
 * - A retenir : Elle peut etre enrichie plus tard avec la presentation institutionnelle de la plateforme.
 */
