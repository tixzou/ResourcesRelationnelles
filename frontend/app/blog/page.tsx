import { title } from "@/components/primitives";

export default function BlogPage() {
  return (
    <div>
      <h1 className={title()}>Blog</h1>
    </div>
  );
}

/**
 * Documentation du fichier
 *
 * - Role : Page Blog minimale issue du template. Elle affiche un titre via la primitive title.
 * - Fonctionnement : Elle ne contient pas encore de liste d'articles ni d'appel backend.
 * - A retenir : Elle peut etre supprimee ou transformee selon le besoin produit.
 */
