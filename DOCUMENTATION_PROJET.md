# Documentation technique du projet

## Vue d'ensemble

`ResourcesRelationnelles` est une application full stack composee de deux parties :

- `backend/` : API REST NestJS exposee sur `http://localhost:3001`, avec Prisma et PostgreSQL.
- `frontend/` : interface Next.js 15 exposee sur `http://localhost:3000`, avec HeroUI, Tailwind CSS et NextAuth.

Le produit permet a des utilisateurs de consulter, creer, commenter, mettre en favori et administrer des ressources relationnelles. Les roles applicatifs sont geres cote backend avec JWT et controles par guards NestJS.

## Architecture generale

Le backend suit une architecture NestJS classique : chaque domaine possede un `module`, un `controller` pour les routes HTTP, un `service` pour la logique metier, des `dto` pour valider les donnees, et parfois des tests `spec`.

Le frontend utilise l'App Router de Next.js : les pages sont dans `frontend/app`, les composants reutilisables dans `frontend/components`, et les constantes globales dans `frontend/config` et `frontend/types`.

## Flux principaux

- Authentification : le frontend appelle NextAuth, qui contacte `POST /auth/login` sur le backend. Le backend renvoie un JWT contenant l'id, l'email, le role, le prenom et le nom.
- Catalogue public : `GET /ressource` renvoie les ressources publiques et validees.
- Detail d'une ressource : `GET /ressource/:id` renvoie la ressource, ses commentaires et l'etat favori si un token est fourni.
- Contribution citoyenne : un utilisateur connecte peut creer, modifier et supprimer ses propres ressources.
- Moderation : moderateurs, administrateurs et super administrateurs peuvent valider, suspendre ou supprimer des ressources.
- Administration : administrateurs et super administrateurs gerent les utilisateurs, les roles, les suspensions et les statistiques.
- Commentaires : les utilisateurs connectes peuvent commenter et supprimer leurs propres commentaires ; l'administration peut moderer les commentaires.

## API backend

| Domaine | Routes principales | Acces |
|---|---|---|
| Auth | `POST /auth/register`, `POST /auth/login` | Public |
| Ressources | `GET /ressource`, `GET /ressource/:id` | Public |
| Ressources utilisateur | `GET /ressource/me`, `POST /ressource`, `PUT /ressource/:id`, `DELETE /ressource/:id` | Connecte |
| Favoris/progression | `POST /ressource/:id/favorite`, `POST /ressource/:id/save`, `POST /ressource/:id/exploit`, `GET /ressource/progression` | Connecte |
| Activites | `POST /ressource/:id/join`, `POST /ressource/:id/invite` | Connecte |
| Categories | `GET /category` | Public |
| Categories admin | `POST /category`, `PATCH /category/:id`, `DELETE /category/:id` | Administrateur, super administrateur |
| Commentaires | `POST /comment`, `DELETE /comment/:id`, `GET /comment/ressource/:id` | Connecte sauf lecture |
| Moderation commentaires | `DELETE /admin/comments/:id`, `DELETE /comment/admin/:id` | Moderateur/admin selon route |
| Messages | `POST /message/activity/:ressourceId`, `GET /message/activity/:ressourceId` | Connecte |
| Admin ressources | `GET /admin/ressources`, `PATCH /admin/ressources/:id/validate`, `PATCH /admin/ressources/:id/suspend`, `PUT /admin/ressources/:id`, `DELETE /admin/ressources/:id` | Moderateur, administrateur, super administrateur |
| Admin utilisateurs | `GET /admin/users`, `PATCH /admin/users/:id/role`, `PATCH /admin/users/:id/toggle-active`, `DELETE /admin/users/:id` | Administrateur, super administrateur |
| Admin stats | `GET /admin/stats`, `GET /admin/stats/export` | Administrateur, super administrateur |

## Modele de donnees

Le schema Prisma definit les entites suivantes :

- `User` : compte utilisateur avec email unique, mot de passe hashe, role, etat actif, dates et relations.
- `Role` : `CITOYEN`, `MODERATEUR`, `ADMINISTRATEUR`, `SUPER_ADMINISTRATEUR`.
- `Category` : categorie unique rattachee aux ressources.
- `Ressource` : contenu partage avec titre, contenu, type, visibilite, validation, vues, auteur et categorie.
- `Comment` : commentaire rattache a une ressource, avec support de reponses via `parentId`.
- `Message` : message envoye dans le chat d'une ressource ou activite.
- `Participation` : inscription/invitation a une activite.
- `Favorite` : favori utilisateur-ressource.
- `SavedResource` : ressource sauvegardee.
- `ExploitedResource` : ressource exploitee, utilisee pour la progression.
- `ViewLog` : journal de consultation de ressource.
- `ConnectionLog` : journal de connexion utilisateur.

Les relations sensibles utilisent souvent `onDelete: Cascade`, ce qui supprime automatiquement les donnees dependantes lorsqu'un utilisateur ou une ressource est supprime.

## Documentation fichier par fichier

### `.gitignore`

Liste les fichiers a exclure de Git : dependances, builds, variables d'environnement, caches et artefacts locaux. Il protege le depot contre l'ajout accidentel de fichiers lourds ou secrets.

### `README.md`

Documentation d'installation et de lancement. Elle explique la stack, les prerequis, Docker/PostgreSQL, les variables d'environnement, les commandes backend/frontend et l'acces Swagger.

## Backend

### `backend/package.json`

Declare l'application NestJS, ses scripts (`build`, `start:dev`, `test`, `lint`) et les dependances principales : NestJS, Prisma, JWT, bcrypt, Swagger, class-validator et Jest.

### `backend/package-lock.json`

Fichier genere par npm qui verrouille les versions exactes des dependances backend. Il garantit des installations reproductibles entre les membres du groupe.

### `backend/README.md`

Documentation generee ou locale du backend NestJS. Elle sert de reference rapide pour les commandes propres a l'API.

### `backend/docker-compose.yml`

Demarre une base PostgreSQL 15 dans le conteneur `ressources_relationnelles_db`. Le port local `5433` est mappe vers le port PostgreSQL interne `5432`, avec l'utilisateur `admin`, le mot de passe `password123` et la base `db_ressources`.

### `backend/nest-cli.json`

Configuration CLI NestJS. Elle indique a Nest comment construire le projet et ou trouver les sources.

### `backend/tsconfig.json`

Configuration TypeScript principale du backend. Elle definit les options de compilation utilisees en developpement.

### `backend/tsconfig.build.json`

Configuration TypeScript dediee au build de production. Elle exclut generalement les tests et fichiers non necessaires a la sortie compilee.

### `backend/eslint.config.mjs`

Configuration ESLint moderne pour le backend. Elle controle la qualite TypeScript et peut appliquer des corrections via `npm run lint`.

## Backend Prisma

### `backend/prisma/schema.prisma`

Source de verite du modele de base de donnees. Il configure PostgreSQL, genere le client Prisma, definit les roles, les tables applicatives, les relations, les index uniques et les suppressions en cascade.

### `backend/prisma/migrations/migration_lock.toml`

Fichier Prisma qui verrouille le fournisseur de base (`postgresql`) pour les migrations. Il evite les incoherences si l'environnement change.

### `backend/prisma/migrations/20260306131610_init/migration.sql`

Migration initiale. Elle pose les premieres tables et fondations SQL du projet.

### `backend/prisma/migrations/20260501100235_new_migration_hugo/migration.sql`

Migration d'evolution du schema. Son nom indique une iteration ajoutee par un membre du groupe ; elle doit etre conservee car Prisma rejoue l'historique dans l'ordre.

### `backend/prisma/migrations/20260501101408_ajout_tables/migration.sql`

Ajoute des tables applicatives complementaires. Elle represente une etape d'enrichissement du domaine metier.

### `backend/prisma/migrations/20260501184342_add_comment_threads/migration.sql`

Ajoute la logique de fils de commentaires, notamment la relation parent/reponses.

### `backend/prisma/migrations/20260501221747_ajout_table_favoris/migration.sql`

Ajoute la table des favoris entre utilisateurs et ressources.

### `backend/prisma/migrations/20260502091320_ajout_views_log_et_connectionlog/migration.sql`

Ajoute les journaux de consultation (`ViewLog`) et de connexion (`ConnectionLog`) utilises par les statistiques.

### `backend/prisma/migrations/20260502124723_add_user_is_active/migration.sql`

Ajoute l'etat `isActive` aux utilisateurs afin de permettre la suspension/reactivation des comptes.

### `backend/prisma/migrations/20260502125049_add_saved_resources/migration.sql`

Ajoute les ressources sauvegardees, distinctes des favoris et de la progression.

## Backend source global

### `backend/src/main.ts`

Point d'entree de l'API. Il cree l'application Nest, active CORS, configure Swagger sur `/api`, ajoute l'authentification Bearer dans la doc, puis ecoute sur `PORT` ou `3001`.

### `backend/src/app.module.ts`

Module racine. Il assemble les domaines `Auth`, `Ressource`, `User`, `Category`, `Comment`, `Stats` et `Message`.

### `backend/src/app.controller.ts`

Controleur racine minimal. Il expose `GET /` et renvoie la reponse de `AppService`.

### `backend/src/app.service.ts`

Service minimal qui renvoie `Hello World!`. Il reste surtout comme squelette NestJS.

### `backend/src/app.controller.spec.ts`

Test unitaire du controleur racine. Il verifie que `GET /` renvoie `Hello World!`.

### `backend/src/prisma.service.ts`

Service NestJS qui etend `PrismaClient`. Il connecte Prisma a l'initialisation du module pour rendre la base disponible dans les services.

## Backend authentification

### `backend/src/auth.module.ts`

Module d'authentification. Il charge `ConfigModule`, configure `JwtModule` avec `JWT_SECRET`, fixe une expiration de token a `1d`, expose le controleur et le service d'auth.

### `backend/src/auth.controller.ts`

Expose `POST /auth/register` et `POST /auth/login`. Il recoit les DTO, puis delegue l'inscription et la connexion a `AuthService`.

### `backend/src/auth.service.ts`

Contient la logique d'authentification : verification d'email unique, hash bcrypt, comparaison de mot de passe, refus des comptes suspendus, generation du JWT, mise a jour du mot de passe et suppression de compte.

### `backend/src/auth.dto.ts`

Definit `RegisterDto` et `LoginDto`. Les champs sont valides avec `class-validator` : email valide, champs obligatoires, mot de passe d'au moins 6 caracteres.

### `backend/src/auth.guard.ts`

Guard JWT. Il lit l'en-tete `Authorization: Bearer ...`, verifie le token avec `JWT_SECRET`, puis attache le payload a `request.user`.

## Backend roles

### `backend/src/roles/decorator.ts`

Expose le decorateur `@Roles(...)`. Il stocke les roles autorises dans les metadata NestJS.

### `backend/src/roles/guard.ts`

Lit les roles requis via `Reflector` et verifie que `request.user.role` fait partie des roles autorises. Il fonctionne apres `AuthGuard`, car il depend du payload utilisateur.

## Backend utilisateurs

### `backend/src/user/user.module.ts`

Module utilisateur. Il regroupe controleurs, service et Prisma pour le domaine `User`.

### `backend/src/user/user.controller.ts`

Controleur utilisateur simple expose sur `/user`. Il semble servir de base ou de point d'extension pour les routes utilisateur non administratives.

### `backend/src/user/admin-user.controller.ts`

Controleur admin expose sur `/admin/users`. Il permet de lister les utilisateurs, changer leur role, suspendre/reactiver un compte et supprimer un utilisateur. L'acces est limite aux administrateurs et super administrateurs.

### `backend/src/user/user.service.ts`

Service metier utilisateur. Il liste les comptes avec des compteurs de ressources/commentaires, met a jour les roles, supprime des utilisateurs et inverse `isActive`.

### `backend/src/user/dto/create-user.dto.ts`

DTO de creation utilisateur actuellement minimal. Il peut etre enrichi si une route de creation utilisateur dediee est ajoutee.

### `backend/src/user/dto/update-user.dto.ts`

DTO de mise a jour utilisateur. Il sert de base aux evolutions de profil ou d'administration.

### `backend/src/user/dto/update-role.dto.ts`

DTO de changement de role. Il permet de recevoir et typer le nouveau role depuis l'API admin.

### `backend/src/user/entities/user.entity.ts`

Classe entite utilisateur actuellement vide/minimale. Dans Nest, ce type sert souvent de placeholder pour documenter ou typer les retours.

### `backend/src/user/user.controller.spec.ts`

Test de presence du controleur utilisateur.

### `backend/src/user/user.service.spec.ts`

Test de presence du service utilisateur avec un mock `PrismaService`.

## Backend ressources

### `backend/src/ressource/ressource.module.ts`

Module ressources. Il branche les controleurs public/admin, le service et Prisma.

### `backend/src/ressource/ressource.controller.ts`

Controleur public et connecte expose sur `/ressource`. Il gere la liste publique, le detail, les ressources de l'utilisateur, la creation, modification, suppression, les favoris, sauvegardes, exploitations, participations et invitations.

### `backend/src/ressource/admin-ressource.controller.ts`

Controleur de moderation expose sur `/admin/ressources`. Il permet de recuperer toutes les ressources, valider, suspendre, modifier ou supprimer n'importe quelle ressource. Les moderateurs, administrateurs et super administrateurs y ont acces.

### `backend/src/ressource/ressource.service.ts`

Service central du catalogue. Il filtre les ressources publiques/validees, journalise les vues, ajoute l'information `isFavorited`, controle que l'auteur modifie uniquement ses ressources, gere favoris/sauvegardes/progression, et applique les actions admin.

### `backend/src/ressource/dto/create-ressource.dto.ts`

DTO de creation de ressource. Il decrit les donnees attendues pour creer un contenu : titre, contenu, type et categorie.

### `backend/src/ressource/dto/update-ressource.dto.ts`

DTO de mise a jour de ressource, generalement derive ou partiel du DTO de creation.

### `backend/src/ressource/entities/ressource.entity.ts`

Entite ressource minimale. Elle peut servir plus tard a documenter les reponses Swagger ou a centraliser un type metier.

### `backend/src/ressource/ressource.controller.spec.ts`

Test de presence du controleur ressource.

### `backend/src/ressource/ressource.service.spec.ts`

Test de presence du service ressource avec dependances mockees.

## Backend categories

### `backend/src/category/category.module.ts`

Module categories. Il assemble le controleur, le service et Prisma.

### `backend/src/category/category.controller.ts`

Expose `GET /category` publiquement pour alimenter les filtres frontend. La creation, modification et suppression sont reservees aux administrateurs et super administrateurs.

### `backend/src/category/category.service.ts`

Service CRUD categories. Il cree, liste par nom ascendant, recupere, modifie et supprime les categories.

### `backend/src/category/dto/create-category.dto.ts`

DTO de creation de categorie. Il valide le nom envoye par le frontend admin.

### `backend/src/category/dto/update-category.dto.ts`

DTO de mise a jour de categorie, adapte aux modifications partielles.

### `backend/src/category/entities/category.entity.ts`

Entite categorie minimale, principalement structurelle.

### `backend/src/category/category.controller.spec.ts`

Test de presence du controleur categories.

### `backend/src/category/category.service.spec.ts`

Test de presence du service categories.

## Backend commentaires

### `backend/src/comment/comment.module.ts`

Module commentaires. Il connecte controleurs, service et Prisma.

### `backend/src/comment/comment.controller.ts`

Expose les routes de commentaires : creation connectee, suppression par auteur, suppression admin et lecture des commentaires d'une ressource.

### `backend/src/comment/admin-comment.controller.ts`

Controleur de moderation dedie expose sur `/admin/comments`. Il permet aux moderateurs et administrateurs de supprimer un commentaire.

### `backend/src/comment/comment.service.ts`

Service commentaires. Il cree un commentaire ou une reponse, inclut les informations auteur, verifie que l'utilisateur est l'auteur avant suppression, et liste les commentaires par ressource dans l'ordre chronologique.

### `backend/src/comment/comment.controller.spec.ts`

Test de presence du controleur commentaires.

## Backend messages

### `backend/src/message/message.module.ts`

Module messages. Il fournit controleur, service et Prisma pour le chat d'activite.

### `backend/src/message/message.controller.ts`

Controleur protege par `AuthGuard`. Il expose l'envoi et la lecture des messages d'une ressource via `/message/activity/:ressourceId`.

### `backend/src/message/message.service.ts`

Service de messagerie. Il cree un message rattache a une ressource et renvoie l'auteur, puis liste l'historique dans l'ordre chronologique.

### `backend/src/message/dto/create-message.dto.ts`

DTO de creation message actuellement minimal. Il peut etre complete avec `content` et validations.

### `backend/src/message/dto/update-message.dto.ts`

DTO de mise a jour message, structurellement prevu pour une future route d'edition.

### `backend/src/message/entities/message.entity.ts`

Entite message minimale.

### `backend/src/message/message.controller.spec.ts`

Test de presence du controleur messages.

### `backend/src/message/message.service.spec.ts`

Test de presence du service messages.

## Backend statistiques

### `backend/src/stats/stats.module.ts`

Module statistiques. Il regroupe controleur, service et Prisma.

### `backend/src/stats/stats.controller.ts`

Controleur admin expose sur `/admin/stats`. Il accepte les filtres `start`, `end` et `categoryId`, puis expose aussi `GET /admin/stats/export`.

### `backend/src/stats/stats.service.ts`

Calcule les indicateurs du tableau de bord : creations, exploitations/favoris, consultations, connexions et commentaires. Il gere la date de fin jusqu'a 23:59:59 et produit une structure exportable par ressource.

### `backend/src/stats/stats.controller.spec.ts`

Test de presence du controleur statistiques.

### `backend/src/stats/stats.service.spec.ts`

Test de presence du service statistiques.

## Backend tests e2e

### `backend/test/jest-e2e.json`

Configuration Jest pour les tests end-to-end NestJS.

### `backend/test/app.e2e-spec.ts`

Test end-to-end initial de l'application. Il verifie le comportement HTTP racine.

## Frontend configuration

### `frontend/package.json`

Declare l'application Next.js, ses scripts (`dev`, `build`, `start`, `lint`) et les dependances UI : HeroUI, NextAuth, Tailwind, lucide-react, framer-motion et React Hook Form.

### `frontend/package-lock.json`

Lockfile npm du frontend. Il verrouille toutes les versions installees pour stabiliser le projet sur les machines du groupe.

### `frontend/README.md`

Documentation locale du frontend, probablement issue du template Next/HeroUI.

### `frontend/LICENSE`

Licence heritee du template ou du projet frontend.

### `frontend/tsconfig.json`

Configuration TypeScript du frontend, incluant les alias comme `@/`.

### `frontend/next.config.js`

Configuration Next.js. Elle est actuellement vide, ce qui signifie que le projet utilise les valeurs par defaut.

### `frontend/postcss.config.js`

Configuration PostCSS utilisee par Tailwind CSS.

### `frontend/eslint.config.mjs`

Configuration ESLint du frontend. Elle encadre TypeScript, React, Next.js, accessibilite et formatage.

### `frontend/hero.ts`

Expose le plugin HeroUI pour Tailwind CSS. Il est importe dans `globals.css`.

### `frontend/styles/globals.css`

Feuille globale. Elle importe Tailwind, active le plugin HeroUI, declare la source HeroUI dans `node_modules` et force des couleurs/familles de police par defaut.

### `frontend/config/fonts.ts`

Configure les polices via `next/font`. Les exports `fontSans` et `fontMono` sont utilises dans le layout global.

### `frontend/config/site.ts`

Centralise le nom du site, la description, les liens de navigation et les liens externes. Plusieurs entrees semblent encore provenir du template HeroUI.

### `frontend/types/index.ts`

Definit `IconSvgProps`, type commun pour les composants SVG d'icones.

## Frontend app

### `frontend/app/layout.tsx`

Layout racine. Il importe les styles globaux, configure les metadata, applique les polices, branche les providers, affiche la navbar et le footer autour de toutes les pages.

### `frontend/app/providers.tsx`

Regroupe les providers client : HeroUI, NextAuth `SessionProvider` et Next Themes. Le theme est force en mode clair.

### `frontend/app/page.tsx`

Page d'accueil. Elle presente l'identite de la plateforme et sert de porte d'entree vers le catalogue.

### `frontend/app/error.tsx`

Boundary d'erreur client Next.js. Elle log l'erreur en console et propose de relancer le rendu du segment.

### `frontend/app/api/auth/[...nextauth]/route.ts`

Route NextAuth. Elle configure le provider credentials, appelle `http://localhost:3001/auth/login`, mappe le token backend dans le JWT NextAuth et l'expose dans la session.

### `frontend/app/ressources/page.tsx`

Page racine des ressources. Elle gere l'etat d'onglet et affiche l'interface catalogue/favoris/mes ressources selon la session.

### `frontend/app/ressources/[id]/page.tsx`

Page detail d'une ressource. Elle charge la ressource, affiche contenu, auteur, categorie et commentaires, gere l'ajout de commentaires/reponses, la suppression de ses commentaires et le toggle favori.

### `frontend/app/administrateur/page.tsx`

Dashboard administration. Il protege l'acces selon le role NextAuth, affiche les onglets ressources, utilisateurs et statistiques, et transmet le token aux composants admin.

### `frontend/app/about/layout.tsx`

Layout simple centre pour la page About. Il provient du template et encadre le contenu enfant.

### `frontend/app/about/page.tsx`

Page About minimale. Elle affiche un titre via les primitives typographiques.

### `frontend/app/blog/layout.tsx`

Layout simple centre pour la page Blog.

### `frontend/app/blog/page.tsx`

Page Blog minimale issue du template.

### `frontend/app/docs/layout.tsx`

Layout simple centre pour la page Docs.

### `frontend/app/docs/page.tsx`

Page Docs minimale issue du template.

### `frontend/app/pricing/layout.tsx`

Layout simple centre pour la page Pricing.

### `frontend/app/pricing/page.tsx`

Page Pricing minimale issue du template.

## Frontend composants globaux

### `frontend/components/navbar.tsx`

Navbar responsive. Elle affiche le logo, les liens, l'ouverture du modal d'authentification, le bouton de deconnexion et l'acces admin pour les roles autorises.

### `frontend/components/footer/footer.tsx`

Footer global. Il affiche le logo, le nom de l'application, des liens institutionnels placeholders et l'annee courante.

### `frontend/components/authentification/authModal.tsx`

Modal d'authentification complet. Il gere connexion, inscription et mode mot de passe oublie, appelle `POST /auth/register`, utilise `signIn("credentials")`, gere les champs, erreurs et visibilite des mots de passe.

### `frontend/components/theme-switch.tsx`

Composant de changement de theme issu du template. Comme le provider force le theme clair, son utilite effective est limitee tant que `forcedTheme="light"` reste actif.

### `frontend/components/icons.tsx`

Bibliotheque locale d'icones SVG : logo, reseaux sociaux, lune, soleil, coeur et recherche.

### `frontend/components/primitives.ts`

Primitives typographiques basees sur `tailwind-variants`. Elles standardisent les classes pour titres et sous-titres.

### `frontend/components/counter.tsx`

Composant exemple du template. Il affiche un compteur local avec un bouton HeroUI.

## Frontend composants ressources

### `frontend/components/ressources/ResourcesHeader.tsx`

Composant de tete pour la page ressources. Il gere session, onglets, recherche, categorie selectionnee et chargement des categories depuis `GET /category`.

### `frontend/components/ressources/PublicResourcesList.tsx`

Liste publique du catalogue. Elle charge `GET /ressource`, filtre selon recherche/categorie, affiche les cartes de ressources et permet d'aller vers le detail.

### `frontend/components/ressources/FavoriteResourcesList.tsx`

Liste des favoris d'un utilisateur connecte. Elle appelle `GET /ressource/favorites/me`, affiche les ressources favorites et permet de retirer un favori via `POST /ressource/:id/favorite`.

### `frontend/components/ressources/MyResourcesManager.tsx`

Gestion des ressources personnelles. Elle charge `GET /ressource/me` et les categories, permet de creer, modifier et supprimer ses ressources, avec remise en attente de validation apres modification.

## Frontend composants administration

### `frontend/components/admin/AdminRessourcesManager.tsx`

Composant principal de moderation du catalogue. Il charge toutes les ressources et categories, filtre par statut/recherche/categorie, valide, suspend, modifie, supprime, gere les categories et affiche/modere les commentaires.

### `frontend/components/admin/AdminUsersManager.tsx`

Gestion des comptes. Il charge `GET /admin/users`, filtre les utilisateurs, suspend/reactive, supprime apres confirmation et permet au super administrateur de changer les roles.

### `frontend/components/admin/AdminStatsManager.tsx`

Tableau de bord statistique. Il charge les categories, interroge `GET /admin/stats` avec filtres de date/categorie, affiche les indicateurs et exporte les donnees via `GET /admin/stats/export`.

## Points d'attention reperes

- Plusieurs URLs API sont codees en dur avec `http://localhost:3001`. Pour un deploiement, mieux vaut utiliser `NEXT_PUBLIC_API_URL`.
- Certains textes/commentaires affichent des caracteres mal encodes dans les fichiers lus. Il faut harmoniser l'encodage en UTF-8 pour eviter les caracteres corrompus.
- `ConnectionLog` existe dans Prisma et les stats, mais l'enregistrement de connexion est commente dans `auth.service.ts`.
- Plusieurs DTO et entites sont encore minimaux ou vides. Ce n'est pas bloquant, mais cela reduit la validation et la documentation Swagger.
- Les tests actuels sont surtout des tests de presence. Les comportements critiques comme auth, roles, moderation et proprietaire de ressource meriteraient des tests plus riches.
- Plusieurs pages et liens (`Docs`, `Pricing`, `Blog`, certains liens de `site.ts`) semblent provenir du template et peuvent etre retires ou personnalises.

