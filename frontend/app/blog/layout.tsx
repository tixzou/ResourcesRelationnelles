export default function BlogLayout({
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
 * - Role : Layout de la section Blog. Il centre les enfants dans une zone de lecture compacte.
 * - Fonctionnement : Il est purement structurel et ne gere aucune donnee.
 * - A retenir : Il partage le meme style que les pages template About, Docs et Pricing.
 */
