export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-16 sm:px-12 lg:px-24">
      <section className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm border border-gray-100">
        <p className="text-sm font-bold uppercase tracking-widest text-[#003E7E]">Nous contacter</p>
        <h1 className="mt-3 text-3xl font-bold text-[#1B365D]">Contact</h1>
        <div className="mt-8 space-y-5 text-gray-600 leading-relaxed">
          <p>
            Pour toute question concernant la plateforme, les ressources ou un probleme de compte, vous pouvez contacter l'equipe projet.
          </p>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-5 text-[#1B365D]">
            <p className="font-semibold">Email</p>
            <p className="mt-1">contact@ressources-relationnelles.fr</p>
          </div>
          <p>
            Cette adresse est provisoire et peut etre remplacee par l'adresse officielle de votre groupe ou de votre organisation.
          </p>
        </div>
      </section>
    </main>
  );
}

/**
 * Documentation du fichier
 *
 * - Role : Page statique de contact.
 * - Fonctionnement : Elle affiche une adresse de contact provisoire pour donner une destination au lien Contact du footer.
 * - A retenir : L'adresse doit etre adaptee avec une vraie adresse avant livraison finale.
 */
