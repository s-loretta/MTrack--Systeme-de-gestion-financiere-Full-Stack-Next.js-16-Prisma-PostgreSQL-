💰 MTrack — Système de Gestion Financière Full-Stack

Une application complète de gestion financière permettant de suivre ses revenus, de fixer des budgets et de visualiser ses dépenses en temps réel, le tout dans une interface fluide et professionnelle.

## 📺 Démonstration Vidéo

Voici un aperçu des fonctionnalités de l'application :




https://github.com/user-attachments/assets/984d6ac9-2e11-4644-b29e-15e735079eb7


---

## 💻 Technologies Utilisées

Ce projet a été développé avec une architecture moderne axée sur la performance, la sécurité et la maintenabilité.

* **Frontend Framework** : [Next.js 16](https://nextjs.org/) (App Router)
* **Langage** : [TypeScript](https://www.typescriptlang.org/) (Assurant un typage strict et une robustesse du code)
* **Authentification** : [Clerk](https://clerk.com/) (Gestion sécurisée des utilisateurs et des sessions)
* **Base de Données & ORM** : [PostgreSQL](https://www.postgresql.org/) avec [Prisma](https://www.prisma.io/)
* **Styling** : [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/) (Interface réactive et composants modernes)
* **Déploiement** : [Vercel](https://vercel.com/)

---

## ✨ Fonctionnalités (Features)

L'application **MTrack** est dotée des fonctionnalités principales suivantes :

* **Tableau de Bord Dynamique** : Visualisation globale de la santé financière avec des graphiques interactifs.
* **Gestion des Budgets** : Création de budgets par catégorie avec suivi de la progression des dépenses.
* **Historique des Transactions** : Liste complète des revenus et dépenses avec possibilité d'ajout et de suppression.
* **Authentification Sécurisée** : Connexion via Google ou Email protégée par Clerk.
* **Synchronisation en Temps Réel** : Mise à jour instantanée des soldes et des graphiques lors de l'ajout de transactions.
* **Design Responsive** : Expérience optimisée pour PC, tablette et mobile.

---

## 🛠️ Processus de Création

Ce projet a été structuré pour simuler une application SaaS réelle :

1.  **Modélisation des Données** : Définition des schémas Prisma pour les Budgets et les Transactions avec relations utilisateurs.
2.  **Architecture Server-First** : Utilisation des *Server Actions* de Next.js pour une manipulation sécurisée des données sans API externes lourdes.
3.  **Gestion de la Sécurité** : Mise en place de middlewares pour restreindre l'accès aux tableaux de bord aux seuls utilisateurs connectés.
4.  **Optimisation UI** : Utilisation de DaisyUI et Lucide-React pour une iconographie et des composants visuellement cohérents.

---

## ⚙️ Démarrer le Projet Localement

Suivez ces instructions pour cloner et exécuter l'application sur votre machine.

### Prérequis
* **Node.js** (v18+)
* **npm** ou **yarn**
* Un compte **Clerk** (pour les clés API)

### 1. Clonage du Répertoire
```bash
git clone [https://github.com/](https://github.com/)[TON_PSEUDO]/MTrack.git
cd MTrack
2. Installation des Dépendances
Bash
npm install
3. Configuration de l'environnement
Créez un fichier .env.local à la racine et ajoutez vos variables :

Extrait de code
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=votre_cle
CLERK_SECRET_KEY=votre_secret
DATABASE_URL=votre_url_postgres
4. Lancement de la Base de Données & App
Bash
npx prisma db push
npm run dev
L'application s'ouvrira à l'adresse http://localhost:3000.

Déployé avec ❤️ sur Vercel.
