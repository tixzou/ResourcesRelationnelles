import { title } from "@/components/primitives";

export default function DocsPage() {
  return (
    <div>
      <h1 className={title()}>Docs</h1>
    </div>
  );
}

/**
 * Documentation du fichier
 *
 * - Role : Page Docs minimale. Elle affiche uniquement le titre de page.
 * - Fonctionnement : Aucun appel API ni etat local n'est utilise dans ce fichier.
 * - A retenir : Elle reste un placeholder tant que la documentation utilisateur n'est pas redigee dans l'interface.
 */
