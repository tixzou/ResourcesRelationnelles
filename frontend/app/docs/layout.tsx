export default function DocsLayout({
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
 * - Role : Layout de la section Docs. Il centre le contenu enfant et limite la largeur de lecture.
 * - Fonctionnement : Il provient du template HeroUI/Next et sert surtout de conteneur.
 * - A retenir : Il peut etre remplace si une vraie documentation utilisateur est ajoutee.
 */
