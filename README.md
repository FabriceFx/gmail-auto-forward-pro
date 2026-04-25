# 🚀 Gmail AutoForward Pro

[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google-apps-script&logoColor=white)](https://developers.google.com/apps-script)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](https://mail.google.com/)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg?style=for-the-badge)](https://unlicense.org/)
[![Version](https://img.shields.io/badge/version-2.0.0-green.svg?style=for-the-badge)](https://github.com/fabricefx/gmail-auto-forward-pro)

**Gmail AutoForward Pro** est un add-on Google Workspace puissant conçu pour automatiser le transfert de courriels avec une flexibilité supérieure aux filtres Gmail standards. Il permet d'ajouter un contexte personnalisé aux messages transférés et de gérer plusieurs règles complexes depuis une interface centralisée.

---

## ✨ Points Forts & fonctionnalités

* **Multi-Règles** : Configurez jusqu'à 10 règles de transfert simultanées avec des critères de recherche distincts.
* **Contextualisation** : Ajoutez un message d'introduction HTML personnalisé au début de chaque mail transféré.
* **Zéro Doublon** : Suivi rigoureux par ID unique (cache de 500 IDs) pour garantir qu'aucun e-mail n'est traité deux fois.
* **Tableau de Bord** : Visualisation en temps réel du statut des règles et de la dernière exécution.
* **Historique Détaillé** : Accès aux 20 derniers messages transférés pour un suivi précis.
* **Gestion des Triggers** : Création automatique de déclencheurs temporels (toutes les heures) liés à l'activation des règles.

---

## 🛠 Technologies utilisées

* **Langage** : Google Apps Script (JavaScript V8).
* **Services Google** : `GmailApp` (Recherche/Transfert), `CardService` (UI), `PropertiesService` (Stockage).
* **Interface** : Google Workspace Add-on (Framework Card).

---

## 🚀 Installation & Configuration

### 1. Prérequis
* Un compte Google (Gmail ou Workspace).
* **Important** : L'adresse de destination doit être validée dans vos paramètres Gmail sous **"Transfert et POP/IMAP"**.

### 2. Configuration du Projet
1.  Ouvrez [Google Apps Script](https://script.google.com/home).
2.  Créez un nouveau projet.
3.  Copiez le contenu de `Code.gs` et `appsscript.json` (activez l'affichage du manifeste dans les paramètres du projet).

### 3. Déploiement
1.  **Déployer** > **Tester les déploiements**.
2.  Sélectionner **Add-on Google Workspace**.
3.  Installer l'add-on pour votre compte.

---

## 📖 Utilisation

1.  **Lancement** : Ouvrez l'icône de l'add-on dans la barre latérale Gmail.
2.  **Configuration** : Cliquez sur "+ Ajouter une règle", saisissez votre requête (ex: `label:finance`) et le destinataire.
3.  **Activation** : Activez l'interrupteur pour que le trigger horaire commence le scan.
4.  **Manuel** : Utilisez "Lancer maintenant" pour un traitement immédiat hors planning.

---

## 📜 Licence

Ce projet est sous licence **Unlicense**. Libre de toute restriction, domaine public.

---

## 👤 Auteur

**Fabrice Faucheux** — [faucheux.bzh](https://faucheux.bzh)

---
---

# 🚀 Gmail AutoForward Pro (English Version)

**Gmail AutoForward Pro** is a professional Google Workspace add-on designed to automate email forwarding with advanced logic beyond standard Gmail filters. It allows for personalized context injection and centralized management of complex forwarding rules.

---

## ✨ Key Features

* **Multi-Rule Engine**: Set up to 10 concurrent forwarding rules with specific search queries.
* **Message Contextualization**: Prepend custom HTML headers to forwarded emails.
* **Duplicate Prevention**: Built-in tracking of up to 500 unique message IDs to avoid double-sending.
* **Status Dashboard**: Real-time monitoring of active rules and last runtime data.
* **Logs & History**: Review the last 20 forwarded items with subject and original sender details.
* **Smart Triggers**: Automated creation/deletion of hourly time-based triggers based on rule status.

---

## 🛠 Tech Stack

* **Language**: Google Apps Script (JavaScript V8).
* **Google APIs**: `GmailApp`, `CardService`, `PropertiesService`.
* **Frontend**: Google Workspace Add-on Card Framework.

---

## 🚀 Installation

### 1. Prerequisites
* A valid Google Account.
* **Note**: Ensure the forwarding address is verified in Gmail Settings > **"Forwarding and POP/IMAP"**.

### 2. Manual Setup
1.  Go to [Google Apps Script](https://script.google.com/home).
2.  Create a new project.
3.  Upload `Code.gs` and update the `appsscript.json` manifest.

### 3. Deployment
1.  Click **Deploy** > **Test deployments**.
2.  Choose **Google Workspace Add-on**.
3.  Install it locally for your account.

---

## 📖 How to Use

1.  **Access**: Click the add-on icon in your Gmail sidebar.
2.  **Create**: Tap "+ Add Rule", enter a search query (e.g., `is:unread from:boss`), and the target email.
3.  **Automate**: Toggle the rule "ON" to enable the background hourly sync.
4.  **Instant**: Use "Run Now" for immediate processing of pending emails.

---

## 📜 License

Distributed under the **Unlicense**. Public domain software.

---

## 👤 Author

**Fabrice Faucheux** — [faucheux.bzh](https://faucheux.bzh)
