
const nextConfig = {
  eslint: {
    // On ne bloque pas le build de production sur les regles de STYLE ESLint
    // (ex: react/no-unescaped-entities sur les apostrophes francaises).
    // Le lint reste disponible via `npm run lint` et tourne dans la CI (pipeline).
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

/**
 * Documentation du fichier
 *
 * - Role : Configuration principale de Next.js pour le frontend.
 * - Fonctionnement : ignoreDuringBuilds evite que des regles de style ESLint fassent
 *   echouer le build de deploiement ; le lint est verifie separement (npm run lint / CI).
 * - A retenir : Les options de build, images, redirects ou variables experimentales se declarent ici.
 */
