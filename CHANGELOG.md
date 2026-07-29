# Changelog

Toutes les évolutions notables de **(RE)Sources Relationnelles** sont documentées dans ce fichier.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et le projet
respecte le [Versionnage Sémantique (SemVer)](https://semver.org/lang/fr/) : `MAJEUR.MINEUR.CORRECTIF`.

- **MAJEUR** : changements incompatibles.
- **MINEUR** : nouvelles fonctionnalités rétrocompatibles.
- **CORRECTIF** : corrections de bugs rétrocompatibles.

## [Non publié]

_Rien pour le moment._

## [1.0.0] - 2026-07-29

Première mise en production (déploiement continu Neon + Vercel).

### Ajouté
- Déploiement continu : backend (NestJS serverless) et frontend (Next.js) sur Vercel,
  connectés au dépôt GitHub (auto-deploy à chaque push sur `main`).
- Base de données PostgreSQL managée sur **Neon** (réplique fidèle du schéma Prisma).
- Intégration continue **GitHub Actions** : tests + build (backend & frontend) sur chaque push et PR.
- **Rate limiting** anti brute-force (`@nestjs/throttler`) : global et renforcé sur l'authentification.
- Politique de **confidentialité RGPD** complète et **bandeau d'information cookies**.
- Fichiers `.env.example` documentant les variables (local et production).

### Modifié
- URL de l'API centralisée côté frontend via `NEXT_PUBLIC_API_URL` (suppression des URLs en dur).
- Configuration de sécurité centralisée (helmet, CORS restreint, `ValidationPipe`).

### Corrigé
- Tests frontend préexistants réparés (mock `next/navigation`, libellés) : suites 100 % vertes.

### Sécurité
- CORS restreint à l'origine du frontend, en-têtes HTTP de sécurité (helmet),
  validation des entrées, `trust proxy` pour une limitation de débit par IP réelle.

[Non publié]: https://github.com/tixzou/ResourcesRelationnelles/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/tixzou/ResourcesRelationnelles/releases/tag/v1.0.0
