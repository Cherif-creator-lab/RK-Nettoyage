# RK Nettoyage Multi Services

Site vitrine et prise de rendez-vous pour **RK Nettoyage Multi Services** (Lyon et alentours — Ain 01, Isère 38, Loire 42), construit avec **Astro**, **Tailwind CSS**, **React** et **Sanity CMS**.

- **Site en ligne (test Vercel) :** https://rk-nettoyage.vercel.app/
- **Studio d'administration :** https://rk-nettoyage.vercel.app/admin
- **Dépôt GitHub :** https://github.com/Cherif-creator-lab/RK-Nettoyage

## Références & inspirations visuelles

- **BlueSpring Cleaning – House Cleaning Website Redesign (Dribbble) :** https://dribbble.com/shots/26149922-BlueSpring-Cleaning-House-Cleaning-Website-Redesign

## Commandes du projet

| Commande | Action |
| :--- | :--- |
| `npm install` | Installer les dépendances |
| `npm run dev` | Lancer le serveur local sur `http://localhost:4321` |
| `npm run build` | Générer le site statique dans `./dist/` |
| `npm run preview` | Prévisualiser le build en local |

---

## Guide de création – Site RK Nettoyage Multi Services

*Nov 15, 2026 · @Simo*

### Ce qui change par rapport au questionnaire

Le site part de Lyon mais doit pouvoir s'étendre à toute la France, et le client ne veut montrer aucune photo de lui ni de ses chantiers. Trois conséquences :

- **Images :** uniquement des images générées par IA ou des photos libres de droits (Unsplash, Pexels), avec une personne dont on ne voit pas clairement le visage.
- **Galerie avant/après :** remplacée par une section « Nos prestations en images », purement illustrative. Ne jamais présenter des images IA comme de vrais avant/après : ce serait une pratique commerciale trompeuse.
- **Zone d'intervention :** stockée dans Sanity comme une liste de villes, pour ajouter une nouvelle ville en deux clics sans toucher au code.

**Infos de départ :** RK Nettoyage Multi Services, Lyon et alentours (Ain 01, Isère 38, Loire 42), `06 20 50 89 92`, `RKnettoyage01@gmail.com`.

---

### Étape 1 : Préparer ton ordinateur et tes comptes

Objectif : avoir tous les outils installés et vérifiés avant d'écrire une seule ligne de code (environ 1 heure).

1. **Node.js :** version LTS (`node -v` ≥ v20).
2. **Git :** installer depuis `git-scm.com`, vérifier avec `git --version` et configurer `user.name` et `user.email`.
3. **Antigravity :** installer et repérer le terminal intégré, l'explorateur de fichiers et le panneau de l'agent.
4. **Comptes gratuits à créer :** Sanity (`sanity.io`), GitHub (`github.com`), hébergeur (Netlify / Vercel), Cal.com (optionnel pour la prise de rendez-vous).
5. Créer un dossier de travail (ex. `Documents/projets/`).

---

### Étape 2 : Rassembler ce que tu as déjà

| Élément | Ce qu'on a | Ce que tu utilises |
| :--- | :--- | :--- |
| Nom | RK Nettoyage Multi Services | Tel quel |
| Téléphone | `06 20 50 89 92` | Tel quel |
| Email | `RKnettoyage01@gmail.com` | Tel quel ; faire un test d'envoi |
| Zone | Lyon et alentours, départements 01, 38, 42 | Lyon, Villeurbanne, Vénissieux + Bourg-en-Bresse (01), Vienne (38), Saint-Étienne (42) |
| Public | Tous publics | Accroche citant particuliers, entreprises, copropriétés et agences |
| Prestations | 7 textes | Les 7 textes (fin de « Lavage des vitres » complétée) |
| Logo | Coché « existant » | Fichier logo fourni ou logo texte provisoire |
| Couleurs | Non précisé | Palette de référence (`#2F4A40`, `#1F332C`, `#F5F6F5`, blanc, `#F2C230`) |
| Horaires | Non précisé | Lundi au samedi, 8 h – 18 h |
| Nom de domaine | Non précisé | Vérifier disponibilité (`rk-nettoyage.fr` / `rknettoyage-lyon.fr`) |
| Infos légales | Non précisé | Champs à remplir dans Sanity (SIRET, statut, adresse, directeur de publication) |

> **Important :** la loi française impose les mentions légales (raison sociale, SIRET, adresse) sur tout site professionnel. Ces champs sont gérés dans Sanity (`/admin`) pour que le client puisse les saisir ou les modifier à tout moment.

---

### Étape 3 : Créer les images sans photos du client

Objectif : 9 images homogènes, avec un homme dont le visage n'est jamais reconnaissable (vu de dos, de profil flou ou cadré sur les mains).

- **Scènes :** Hero (16:9), Bureaux, Débarras, Remise en état, Espaces verts, Parties communes, Bricolage, Vitres, Fond « Pourquoi nous choisir ».
- **Préparation :** format WebP optimisé (`1920 px` pour le hero, `1200 px` pour les autres), nommées clairement (`hero.webp`, `vitres.webp`, etc.).
- **Alternative sans IA :** photos libres de droits (Unsplash / Pexels).

---

### Étape 4 : Créer le projet Astro + Sanity

1. `npm create astro@latest rk-nettoyage` (modèle minimal « Empty », installer les dépendances, initialiser Git).
2. Ajouter les intégrations :
   - `npx astro add @sanity/astro @astrojs/react`
   - `npx astro add tailwind`
   - `npm install sanity`
3. Créer le projet sur `sanity.io/manage`, configurer les **CORS origins** (`http://localhost:4321` et l'URL en ligne avec *Allow credentials*).
4. Configurer `.env`, `astro.config.mjs`, `sanity.config.ts` et `src/env.d.ts`.

---

### Étape 5 : Définir les schémas Sanity

Dans `src/sanity/schemas/` :
1. **`settings`** (document unique) : `siteName`, `logo`, `phone`, `email`, `footerText`, `legalName`, `legalStatus`, `siret`, `address`, `publicationDirector`.
2. **`homePage`** (document unique) : `heroTitle`, `heroSubtitle`, `heroImage`, `steps` (3), `missionCards` (3), `whyCards` (3).
3. **`service`** : `title`, `slug`, `shortDescription`, `body` (Portable Text), `image` (avec `alt` obligatoire), `icon`, `order`.
4. **`zone`** : `city`, `department`, `slug`, `isActive`, `localIntro`.

---

### Étape 6 : Construire le design et les pages

- **Base :** `src/layouts/BaseLayout.astro`, `src/styles/global.css` (Poppins, couleurs `#2F4A40`, `#1F332C`, `#F5F6F5`, `#F2C230`, boutons `rounded-full`, cartes `rounded-xl`), navbar flottante avec menu burger mobile et pied de page vert foncé.
- **Page d'accueil :** Hero → Bandeau zones qui défilent → 3 étapes reliées par ligne pointillée → Mission (3 cartes) → Pourquoi nous choisir (fond sombre + 3 cartes) → Prestations (blocs alternés) → Nos prestations en images (grille de 6 images illustratives) → Devis & rendez-vous.
- **Autres pages :** `/prestations/[slug]`, `/zones/[slug]`, `/contact`, `/mentions-legales`, `/confidentialite`.
- **Vérification mobile :** test en largeur `390 px` sans débordement horizontal.

---

### Étape 7 : Remplir le contenu dans Sanity

Saisir et publier (`Publish`) dans `/admin` : Paramètres du site, Page d'accueil, les 7 Prestations (`order` 1 à 7) et les 6 Zones de départ (`Lyon`, `Villeurbanne`, `Vénissieux`, `Bourg-en-Bresse`, `Vienne`, `Saint-Étienne`).

---

### Étape 8 : Brancher le formulaire de devis et la prise de rendez-vous

- Formulaire détaillé (nom, type de client, téléphone, e-mail, prestation, ville, détails) avec sélecteur de jour et de créneau horaire intégré (`src/components/QuoteForm.tsx`).
- Envoi par e-mail via `PUBLIC_WEB3FORMS_KEY` (ou `PUBLIC_FORMSPREE_URL`, avec repli `mailto:`).

---

### Étape 9 : Référencement (SEO local)

- Balises `title`, `meta description`, Open Graph et URL canonique dans `BaseLayout.astro`.
- Pages dédiées par ville `/zones/[slug]` générées automatiquement pour chaque zone active dans Sanity.
- À prévoir à la mise en ligne finale : Google Business Profile, `@astrojs/sitemap` et Google Search Console.

---

### Étape 10 : Pages légales obligatoires

- `/mentions-legales` : raison sociale, statut juridique, adresse, SIRET, téléphone, e-mail, directeur de publication, hébergeur.
- `/confidentialite` : données collectées, durée de conservation, droits RGPD et e-mail de contact.

---

### Étape 11 : Mettre le site en ligne

- Code poussé sur GitHub (`main`), `.env` exclu via `.gitignore`.
- Déploiement connecté sur Vercel (`PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_WEB3FORMS_KEY`).
- Autorisation de l'URL en ligne dans Sanity (**CORS origins**) et configuration optionnelle d'un **Webhook Sanity → Deploy Hook** pour reconstruire automatiquement à chaque publication.

---

### Étape 12 : Tester et livrer au client

- Vérifier l'affichage mobile sans débordement horizontal, l'envoi réel du formulaire de devis, les liens du pied de page et le score PageSpeed.
- Inviter le client dans Sanity (`sanity.io/manage → Members → Invite`, rôle **Editor**) et lui faire une démonstration de prise en main de `/admin`.
