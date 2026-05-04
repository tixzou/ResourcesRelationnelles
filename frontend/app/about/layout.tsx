export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        {children}
      </div>
    </section>
  );
}

/**
 * Documentation du fichier
 *
 * - Role : Layout specifique de la section About. Il centre le contenu enfant dans une section verticale.
 * - Fonctionnement : Il fournit une structure visuelle simple et reutilisee par plusieurs pages template.
 * - A retenir : Il n'applique pas de logique metier ni d'appel API.
 */
