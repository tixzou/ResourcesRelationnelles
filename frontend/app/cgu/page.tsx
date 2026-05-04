export default function CguPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-16 sm:px-12 lg:px-24">
      <section className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm border border-gray-100">
        <p className="text-sm font-bold uppercase tracking-widest text-[#003E7E]">Informations legales</p>
        <h1 className="mt-3 text-3xl font-bold text-[#1B365D]">Conditions generales d'utilisation</h1>
        <div className="mt-8 space-y-5 text-gray-600 leading-relaxed">
          <p>
            Cette page presente les conditions d'utilisation de la plateforme (RE)Sources Relationnelles.
          </p>
          <p>
            Les utilisateurs s'engagent a utiliser le service de maniere respectueuse, a publier des contenus adaptes et a ne pas porter atteinte aux autres membres.
          </p>
          <p>
            Les ressources, commentaires et interactions peuvent etre moderes afin de garantir un espace utile, bienveillant et conforme aux objectifs du projet.
          </p>
        </div>
      </section>
    </main>
  );
}

/**
 * Documentation du fichier
 *
 * - Role : Page statique des conditions generales d'utilisation.
 * - Fonctionnement : Elle affiche un contenu simple pour donner une destination au lien CGU du footer.
 * - A retenir : Le texte peut etre remplace plus tard par une version juridique complete.
 */
