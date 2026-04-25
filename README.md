# 📨 gmail-auto-forward-pro

[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google-apps-script&logoColor=white)](https://developers.google.com/apps-script)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](https://mail.google.com/)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg?style=for-the-badge)](https://unlicense.org/)

**gmail-auto-forward-pro** est un Add-on Gmail avancé conçu pour automatiser le transfert de messages spécifiques vers une adresse de destination, tout en y ajoutant un message d'accompagnement personnalisé et un suivi en temps réel via un tableau de bord intégré.

---

## ✨ Fonctionnalités

* **Automatisation Intelligente** : Exécution automatique en arrière-plan toutes les 15 minutes (configurable).
* **Filtrage Avancé** : Utilisation de la syntaxe de recherche Gmail native (ex: `is:unread`, `from:boss@company.com`) pour cibler précisément les emails à transférer.
* **Personnalisation HTML** : Ajout automatique d'une note d'introduction formatée au début de chaque email transféré.
* **Tableau de Bord Intégré** : Visualisation de l'état du service, de la dernière exécution et du nombre total de messages traités.
* **Historique des Transferts** : Consultation des 20 derniers messages transférés avec leur statut et date.
* **Gestion de Mémoire** : Suivi individuel des messages pour éviter les doublons, avec une limite de stockage de 500 IDs pour respecter les quotas Google.

---

## 🚀 Installation Manuelle

### 1. Prérequis
* Un compte Google (Gmail ou Google Workspace).
* **Important** : L'adresse email de destination doit être validée dans vos paramètres Gmail sous l'onglet **"Transfert et POP/IMAP"**.

### 2. Création du Projet
1.  Rendez-vous sur [Google Apps Script](https://script.google.com/home).
2.  Cliquez sur **Nouveau projet**.
3.  Renommez le projet : `Gmail Auto Forward Pro`.

### 3. Configuration du Code
1.  Copiez le contenu du fichier `Code.gs` et collez-le dans l'éditeur de script (remplacez le code existant).
2.  Accédez aux **Paramètres du projet** (icône roue dentée) et cochez la case **"Afficher le fichier manifeste 'appsscript.json' dans l'éditeur"**.
3.  Revenez à l'éditeur, ouvrez `appsscript.json` et remplacez son contenu par celui fourni dans le dépôt.

### 4. Déploiement
1.  Cliquez sur **Déployer** > **Tester les déploiements**.
2.  Sélectionnez le type **Add-on Google Workspace**.
3.  Installez le déploiement de test pour votre compte.

---

## 🛠 Utilisation

1.  Ouvrez Gmail sur votre navigateur.
2.  Cliquez sur l'icône de l'Add-on dans la barre latérale droite (icône de transfert bleue).
3.  **Configuration** :
    * **Requête Gmail** : Saisissez votre filtre (ex: `label:urgent`).
    * **Email de destination** : Saisissez l'adresse de réception.
    * **Message d'accompagnement** : (Optionnel) Votre texte d'intro.
4.  Cliquez sur **Enregistrer** pour activer le déclencheur automatique.

---

## ⚙️ Détails Techniques

* **Runtime** : V8 Engine.
* **Fréquence** : 15 minutes.
* **Limites** : 50 fils (threads) par exécution pour éviter les timeouts de 6 minutes de Google Apps Script.
* **Stockage** : Utilisation de `PropertiesService` (Script et User) pour la persistance des données.

---

## 📜 Licence

Ce projet est placé sous la licence **Unlicense**. Vous êtes libre de copier, modifier, publier ou distribuer ce logiciel sans aucune restriction.

---

## 👥 Auteur

* **FabriceFX** - *Développement initial*

---

# 📨 gmail-auto-forward-pro (English)

**gmail-auto-forward-pro** is an advanced Gmail Add-on designed to automate the forwarding of specific messages to a destination address, while adding a custom introduction message and providing real-time tracking via an integrated dashboard.

---

## ✨ Features

* **Smart Automation**: Automatic background execution every 15 minutes (configurable).
* **Advanced Filtering**: Uses native Gmail search syntax (e.g., `is:unread`, `from:boss@company.com`) to target specific emails.
* **HTML Customization**: Automatically prepends a formatted introduction note to each forwarded email.
* **Integrated Dashboard**: View service status, last execution time, and total messages processed.
* **Transfer History**: Review the last 20 forwarded messages with their status and date.
* **Memory Management**: Individual message tracking to prevent duplicates, with a 500 ID storage limit to respect Google quotas.

---

## 🚀 Manual Installation

### 1. Prerequisites
* A Google account (Gmail or Google Workspace).
* **Important**: The destination email address must be verified in your Gmail settings under the **"Forwarding and POP/IMAP"** tab.

### 2. Project Creation
1.  Go to [Google Apps Script](https://script.google.com/home).
2.  Click on **New Project**.
3.  Rename the project: `Gmail Auto Forward Pro`.

### 3. Code Configuration
1.  Copy the content of the `Code.gs` file and paste it into the script editor (replacing existing code).
2.  Go to **Project Settings** (gear icon) and check **"Show 'appsscript.json' manifest file in editor"**.
3.  Return to the editor, open `appsscript.json`, and replace its content with the one provided in the repository.

### 4. Deployment
1.  Click **Deploy** > **Test deployments**.
2.  Select **Google Workspace Add-on** type.
3.  Install the test deployment for your account.

---

## 🛠 Usage

1.  Open Gmail in your browser.
2.  Click the Add-on icon in the right sidebar (blue forward icon).
3.  **Configuration**:
    * **Gmail Query**: Enter your filter (e.g., `label:urgent`).
    * **Destination Email**: Enter the recipient's address.
    * **Companion Message**: (Optional) Your intro text.
4.  Click **Save** to enable the automatic trigger.

---

## ⚙️ Technical Details

* **Runtime**: V8 Engine.
* **Frequency**: 15 minutes.
* **Limits**: 50 threads per execution to prevent Google Apps Script's 6-minute timeouts.
* **Storage**: Uses `PropertiesService` (Script and User) for data persistence.

---

## 📜 License

This project is released under the **Unlicense**. You are free to copy, modify, publish, or distribute this software without any restrictions.

---

## 👥 Author

* **FabriceFX** - *Initial Development*
