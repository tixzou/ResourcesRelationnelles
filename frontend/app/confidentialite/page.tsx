export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-16 sm:px-12 lg:px-24">
      <section className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm border border-gray-100">
        <p className="text-sm font-bold uppercase tracking-widest text-[#003E7E]">Donnees personnelles</p>
        <h1 className="mt-3 text-3xl font-bold text-[#1B365D]">Politique de confidentialite</h1>
        <div className="mt-8 space-y-5 text-gray-600 leading-relaxed">
          <p>
            Cette page explique de facon simple comment les donnees peuvent etre utilisees dans le cadre de la plateforme.
          </p>
          <p>
            Les informations de compte servent a identifier les utilisateurs, securiser l'acces et permettre les fonctionnalites de contribution, de favoris et de commentaires.
          </p>
          <p>
            Les donnees ne sont pas destinees a etre revendues. Une version complete pourra preciser les durees de conservation et les droits des utilisateurs.
          </p>
        </div>
      </section>
    </main>
  );
}

/**
 * Documentation du fichier
 *
 * - Role : Page statique de politique de confidentialite.
 * - Fonctionnement : Elle affiche un contenu minimal pour donner une destination au lien Confidentialite du footer.
 * - A retenir : Le texte doit etre complete avant une mise en production officielle.
 */
