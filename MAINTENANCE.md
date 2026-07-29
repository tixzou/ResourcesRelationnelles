# Maintenance du logiciel

Ce document décrit les outils et procédures de **maintenance** de (RE)Sources Relationnelles :
la **gestion des versions** et la **gestion des évolutions et des incidents**.

---

## 1. Gestion des versions

**Outils : Git + GitHub Releases + Versionnage Sémantique (SemVer) + `CHANGELOG.md`.**

### Versionnage sémantique (SemVer)
Le numéro de version suit le format `MAJEUR.MINEUR.CORRECTIF` :

| Incrément | Quand ? | Exemple |
|---|---|---|
| **MAJEUR** | Changement incompatible | `1.0.0` → `2.0.0` |
| **MINEUR** | Nouvelle fonctionnalité rétrocompatible | `1.0.0` → `1.1.0` |
| **CORRECTIF** | Correction de bug rétrocompatible | `1.0.0` → `1.0.1` |

La version est portée par les `package.json` (backend et frontend) et par un **tag Git**.

### Journal des modifications
Chaque version est décrite dans [`CHANGELOG.md`](./CHANGELOG.md) (format *Keep a Changelog*),
avec les sections *Ajouté / Modifié / Corrigé / Sécurité*.

### Procédure de publication d'une version
1. Mettre à jour `CHANGELOG.md` (déplacer les entrées de « Non publié » vers la nouvelle version).
2. Mettre à jour la version dans les `package.json`.
3. Créer un tag Git annoté et le pousser :
   ```bash
   git tag -a v1.1.0 -m "Version 1.1.0"
   git push origin v1.1.0
   ```
4. Créer la **Release GitHub** correspondante (notes issues du CHANGELOG).
5. Vercel déploie automatiquement `main`, la CI GitHub Actions valide tests + build.

### Stratégie de branches
- `main` : branche de **production** (protégée, déployée automatiquement).
- `develop` : intégration des développements.
- `feature/*` : une branche par fonctionnalité, fusionnée via **Pull Request**.

---

## 2. Gestion des évolutions et des incidents

**Outil : GitHub Issues + Projects, avec modèles et étiquettes (labels).**

### Modèles d'issues
Deux modèles guident la saisie (dossier [`.github/ISSUE_TEMPLATE`](./.github/ISSUE_TEMPLATE)) :
- **🐛 Signalement de bug** — pour les **incidents** (description, reproduction, gravité).
- **✨ Demande d'évolution** — pour faire **évoluer la solution** (besoin, solution, priorité).

Chaque Pull Request suit également un [modèle](./.github/PULL_REQUEST_TEMPLATE.md)
(type de changement, checklist tests/build, issue liée).

### Étiquettes (labels) recommandées
| Label | Usage |
|---|---|
| `bug` | Dysfonctionnement à corriger |
| `enhancement` | Évolution / nouvelle fonctionnalité |
| `incident` | Incident de production à traiter en priorité |
| `security` | Sujet de sécurité |
| `priority:high` / `priority:low` | Priorisation |

### Cycle de vie d'une demande
```
Ouverture (issue)  →  Qualification / priorisation  →  Développement (branche + PR)
   →  Revue + CI verte  →  Fusion dans main  →  Déploiement auto  →  Clôture de l'issue
```

### Suivi (GitHub Projects)
Un tableau **Projects** (colonnes *À faire → En cours → En revue → Terminé*) permet à
l'équipe de production de suivre incidents et évolutions et de piloter les priorités.
