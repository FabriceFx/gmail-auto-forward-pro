# 🚀 Gmail AutoForward Pro

[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google-apps-script&logoColor=white)](https://developers.google.com/apps-script)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](https://mail.google.com/)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg?style=for-the-badge)](https://unlicense.org/)

**Gmail AutoForward Pro** est un Add-on Google Apps Script conçu pour combler les lacunes des filtres de transfert natifs de Gmail. Contrairement aux filtres standards, cet outil vous permet d'ajouter un contexte personnalisé à chaque mail transféré et de suivre l'activité via un tableau de bord intégré.

---

## Pourquoi utiliser cet outil ?

* **Notes personnalisées** : Ajoutez une introduction HTML automatique avant le message d'origine pour donner du contexte à vos transferts.
* **Zéro doublon** : Suivi rigoureux par ID unique (et non par fil de discussion) pour garantir qu'aucun message n'est traité deux fois.
* **Tableau de bord** : Visualisez l'état de votre automate et l'historique en mémoire (jusqu'à 500 transferts enregistrés).
* **Auto-piloté** : Gestion intelligente des déclencheurs (triggers) temporels activables directement depuis l'interface de configuration.

---

## Fonctionnalités techniques

* **Filtrage avancé** : Utilisation de la syntaxe de recherche Gmail native (ex: `is:unread`, `from:boss@company.com`).
* **Exécution en arrière-plan** : Analyse automatique toutes les 15 minutes.
* **Historique détaillé** : Consultation des messages récemment traités avec sujet, date et expéditeur.

---

## Installation manuelle

### 1. Prérequis
* Un compte Google (Gmail ou Workspace).
* **Important** : L'adresse de destination doit être validée dans vos paramètres Gmail (onglet "Transfert et POP/IMAP").

### 2. Configuration du script
1.  Créez un nouveau projet sur [Google Apps Script](https://script.google.com/home).
2.  Copiez le contenu de `Code.gs`.
3.  Activez l'affichage du fichier manifeste `appsscript.json` dans les paramètres et remplacez son contenu.

### 3. Déploiement
1.  **Déployer** > **Tester les déploiements**.
2.  Choisissez le type **Add-on Google Workspace**.
3.  Installez-le pour votre propre compte.

---

## 📜 Licence

Logiciel libre et sans restriction (Public Domain) sous licence **Unlicense**.

---

## 🏷 Topics GitHub
`google-apps-script`, `gmail-addon`, `automation`, `productivity`, `workflow`, `javascript`

---

# 🚀 Gmail AutoForward Pro (English)

**Gmail AutoForward Pro** is a Google Apps Script Add-on designed to bridge the gaps in Gmail's native forwarding filters. Unlike standard filters, this tool allows you to add personalized context to every forwarded email and track activity through an integrated dashboard.

---

## 🌟 Why use this tool?

* **Custom Notes**: Automatically add an HTML introduction before the original message to provide context for your forwards.
* **Zero Duplicates**: Rigorous tracking by unique message ID (rather than thread) ensures no message is processed twice.
* **Dashboard**: Monitor your automation status and history in memory (up to 500 recorded transfers).
* **Auto-pilot**: Smart management of time-based triggers, togglable directly from the configuration interface.

---

## ✨ Technical Features

* **Advanced Filtering**: Leverages native Gmail search syntax (e.g., `is:unread`, `from:boss@company.com`).
* **Background Execution**: Automatic scans every 15 minutes.
* **Detailed History**: Review recently processed messages with subject, date, and sender details.

---

## 🚀 Manual Installation

### 1. Prerequisites
* A Google account (Gmail or Workspace).
* **Important**: The destination address must be verified in your Gmail settings (under the "Forwarding and POP/IMAP" tab).

### 2. Script Setup
1.  Create a new project at [Google Apps Script](https://script.google.com/home).
2.  Copy the content of `Code.gs`.
3.  Enable the `appsscript.json` manifest file in settings and replace its content.

### 3. Deployment
1.  **Deploy** > **Test deployments**.
2.  Select **Google Workspace Add-on**.
3.  Install it for your own account.

---

## 📜 License

Free and unencumbered software released into the public domain under the **Unlicense**.
