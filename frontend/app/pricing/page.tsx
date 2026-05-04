import { title } from "@/components/primitives";

export default function PricingPage() {
  return (
    <div>
      <h1 className={title()}>Pricing</h1>
    </div>
  );
}

/**
 * Documentation du fichier
 *
 * - Role : Page Pricing minimale. Elle affiche seulement un titre provenant du template.
 * - Fonctionnement : Elle n'est pas liee au domaine des ressources relationnelles pour l'instant.
 * - A retenir : Elle peut etre retiree si aucun modele tarifaire n'existe dans le projet.
 */
