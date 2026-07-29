export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-16 sm:px-12 lg:px-24">
      <section className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm border border-gray-100">
        <p className="text-sm font-bold uppercase tracking-widest text-[#003E7E]">Donnees personnelles</p>
        <h1 className="mt-3 text-3xl font-bold text-[#1B365D]">Politique de confidentialite</h1>
        <p className="mt-2 text-sm text-gray-400">Conforme au Reglement General sur la Protection des Donnees (RGPD).</p>

        <div className="mt-8 space-y-8 text-gray-600 leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-[#1B365D]">1. Responsable du traitement</h2>
            <p className="mt-2">
              La plateforme (RE)Sources Relationnelles est responsable du traitement des donnees
              collectees dans le cadre de son utilisation. Pour toute question, contactez-nous via
              la page Contact.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#1B365D]">2. Donnees collectees</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Donnees de compte : adresse email, nom, prenom.</li>
              <li>Mot de passe : jamais stocke en clair, uniquement sous forme chiffree (hachage bcrypt).</li>
              <li>Contenus que vous creez : ressources, commentaires, favoris.</li>
              <li>Donnees techniques minimales : journaux de connexion et de consultation, a des fins de securite et de statistiques agregees.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#1B365D]">3. Finalites et base legale</h2>
            <p className="mt-2">
              Les donnees servent a : creer et securiser votre compte, permettre la contribution,
              les favoris et les commentaires, moderer les contenus et produire des statistiques
              agregees. La base legale est l'execution du service et votre consentement lors de la
              creation du compte.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#1B365D]">4. Duree de conservation</h2>
            <p className="mt-2">
              Vos donnees sont conservees tant que votre compte est actif. En cas de suppression de
              votre compte, vos donnees personnelles et vos contributions liees sont supprimees.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#1B365D]">5. Securite</h2>
            <p className="mt-2">
              Mots de passe haches (bcrypt), communications chiffrees (HTTPS), authentification par
              jetons signes (JWT), acces restreint par roles, limitation du debit des requetes contre
              les abus, et en-tetes de securite HTTP.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#1B365D]">6. Vos droits (RGPD)</h2>
            <p className="mt-2">
              Vous disposez d'un droit d'acces, de rectification, d'effacement, de portabilite,
              de limitation et d'opposition. Vous pouvez modifier vos informations depuis votre
              espace personnel, ou supprimer definitivement votre compte et vos donnees. Pour toute
              demande, utilisez la page Contact.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#1B365D]">7. Cookies</h2>
            <p className="mt-2">
              La plateforme n'utilise que des cookies strictement necessaires a son fonctionnement
              (maintien de votre session de connexion). Aucun cookie publicitaire ni de tracage
              tiers n'est depose.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

/**
 * Documentation du fichier
 *
 * - Role : Page de politique de confidentialite conforme RGPD.
 * - Fonctionnement : Elle detaille les donnees collectees, les finalites, la conservation,
 *   les mesures de securite, les droits des utilisateurs et l'usage des cookies.
 * - A retenir : Contenu aligne avec les exigences RGPD des consignes du projet.
 */
