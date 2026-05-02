<div align="center">

# 🤝 (RE)Sources Relationnelles

**Plateforme institutionnelle pour améliorer la qualité de nos relations humaines.**

![NestJS](https://img.shields.io/badge/Backend-NestJS-e0234e?logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

</div>

---

## 📋 Table des matières

- [Présentation](#-présentation)
- [Prérequis](#-prérequis)
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
  - [1. Cloner le dépôt](#1-cloner-le-dépôt)
  - [2. Base de données (Docker)](#2-base-de-données-docker)
  - [3. Backend (NestJS)](#3-backend-nestjs)
  - [4. Frontend (Next.js)](#4-frontend-nextjs)
- [Variables d'environnement](#-variables-denvironnement)
- [Lancer le projet](#-lancer-le-projet)
- [Documentation API](#-documentation-api)

---

## 🌐 Présentation

**(RE)Sources Relationnelles** est une application web full-stack permettant aux citoyens de partager, consulter et commenter des ressources (articles, vidéos, jeux…) pour améliorer leurs relations humaines.

Elle propose :
- 📚 Un catalogue de ressources filtrables par catégorie et type
- 🔐 Un système d'authentification JWT avec gestion des rôles
- 💬 Des commentaires sur les ressources
- ✉️ Une messagerie entre utilisateurs

---

## ✅ Prérequis

Avant d'installer le projet, assurez-vous d'avoir les outils suivants installés sur votre machine :

| Outil | Version minimale | Lien |
|---|---|---|
| **Node.js** | v20+ | [nodejs.org](https://nodejs.org) |
| **npm** | v10+ | Inclus avec Node.js |
| **Docker** | v24+ | [docker.com](https://www.docker.com/get-started) |
| **Docker Compose** | v2+ | Inclus avec Docker Desktop |
| **Git** | v2+ | [git-scm.com](https://git-scm.com) |

> 💡 Pour vérifier vos versions : `node -v`, `npm -v`, `docker -v`, `docker compose version`

---

## 📁 Structure du projet

```
ResourcesRelationnelles/
├── backend/          # API REST — NestJS + Prisma + PostgreSQL
│   ├── prisma/       # Schéma de base de données et migrations
│   └── src/          # Code source (modules, controllers, services)
└── frontend/         # Interface utilisateur — Next.js 15 + HeroUI + Tailwind CSS
    ├── app/          # Pages (App Router)
    └── components/   # Composants réutilisables
```

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/schhean/ResourcesRelationnelles.git
cd ResourcesRelationnelles
```

---

### 2. Base de données (Docker)

Le projet utilise **PostgreSQL** via Docker Compose.

```bash
cd backend
docker compose up -d
```

> ✅ Cela démarre un conteneur PostgreSQL sur le port **5433** de votre machine.

Vérifiez que le conteneur tourne :

```bash
docker ps
```

---

### 3. Backend (NestJS)

Depuis le dossier `backend/` :

**a) Installer les dépendances**

```bash
npm install
```

**b) Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du dossier `backend/` :

```bash
cp .env.example .env   # si le fichier exemple existe, sinon créez-le manuellement
```

Contenu du fichier `.env` :

```env
DATABASE_URL="postgresql://admin:password123@localhost:5433/db_ressources"
JWT_SECRET="votre_secret_jwt_tres_securise"
PORT=3001
```

**c) Appliquer les migrations Prisma**

```bash
npx prisma migrate dev
```

> Cette commande crée les tables dans la base de données et génère le client Prisma.

**d) (Optionnel) Explorer la base de données avec Prisma Studio**

```bash
npx prisma studio
```

---

### 4. Frontend (Next.js)

Depuis le dossier `frontend/` :

**a) Installer les dépendances**

```bash
cd ../frontend
npm install
```

**b) Configurer les variables d'environnement**

Créez un fichier `.env.local` à la racine du dossier `frontend/` :

```bash
cp .env.example .env.local
```

Contenu du fichier `.env.local` :

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre_secret_nextauth
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🔐 Variables d'environnement

### Backend (`backend/.env`)

| Variable | Description | Exemple |
|---|---|---|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://admin:password123@localhost:5433/db_ressources` |
| `JWT_SECRET` | Clé secrète pour signer les tokens JWT | `mon_super_secret` |
| `PORT` | Port d'écoute du serveur | `3001` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Exemple |
|---|---|---|
| `NEXTAUTH_URL` | URL de base du frontend | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Clé secrète NextAuth | `mon_secret_nextauth` |
| `NEXT_PUBLIC_API_URL` | URL de l'API backend | `http://localhost:3001` |

---

## ▶️ Lancer le projet

Ouvrez **deux terminaux** distincts.

**Terminal 1 — Backend :**

```bash
cd backend
npm run start:dev
```

> Le serveur démarre sur [http://localhost:3001](http://localhost:3001)

**Terminal 2 — Frontend :**

```bash
cd frontend
npm run dev
```

> L'application est disponible sur [http://localhost:3000](http://localhost:3000)

---

## 📖 Documentation API

Une documentation Swagger est disponible automatiquement lorsque le backend est lancé :

👉 [http://localhost:3001/api](http://localhost:3001/api)

Elle liste tous les endpoints disponibles avec leurs paramètres, corps de requête et réponses attendues.

---

## 🧪 Tests

Pour lancer les tests du backend :

```bash
cd backend
npm run test          # Tests unitaires
npm run test:cov      # Tests avec couverture de code
npm run test:e2e      # Tests end-to-end
```

---

<div align="center">
  Fait avec ❤️ — Projet (RE)Sources Relationnelles
</div>