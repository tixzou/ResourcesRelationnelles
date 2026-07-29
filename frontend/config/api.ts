/**
 * Configuration centralisee de l'URL de l'API backend (NestJS).
 *
 * - En LOCAL      : NEXT_PUBLIC_API_URL vaut http://localhost:3001
 *                   (ou est absent -> on retombe sur la valeur par defaut ci-dessous).
 * - En PRODUCTION : NEXT_PUBLIC_API_URL pointe vers le backend deploye (Vercel).
 *
 * Regle : toute requete vers l'API DOIT utiliser API_URL, jamais une URL en dur.
 * Le .replace supprime un eventuel slash final pour eviter les doubles slashs.
 */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
).replace(/\/+$/, "");
