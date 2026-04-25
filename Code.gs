/**
 * Constantes pour l'application
 */
const CONFIG = {
  MAX_THREADS: 50,            // Limite de threads par exécution (timeout 6 min)
  PROCESSED_IDS_KEY: "processedMessageIds",  // Clé de stockage des IDs traités
  MAX_STORED_IDS: 500,        // ~500 IDs × 18 chars ≈ 9 KB (limite PropertiesService)
  LAST_RUN_KEY: "lastRunDate", // Date du dernier transfert
  LAST_COUNT_KEY: "lastRunCount", // Nombre du dernier batch transféré
  TRIGGER_INTERVAL_MIN: 15    // Intervalle du déclencheur temporel (en minutes)
};

/**
 * Affiche l'interface de configuration
 */
function buildSettingsCard() {
  const props = PropertiesService.getUserProperties();
  
  // En-tête stylisé avec une icône Material
  const header = CardService.newCardHeader()
    .setTitle("Automatisation Gmail")
    .setSubtitle("Paramètres de transfert automatique")
    .setImageUrl("https://www.gstatic.com/images/icons/material/system/2x/forward_to_inbox_googblue_48dp.png")
    .setImageStyle(CardService.ImageStyle.CIRCLE);

  // Section d'information
  const infoSection = CardService.newCardSection()
    .addWidget(CardService.newDecoratedText()
      .setText("Configurez vos règles de transfert automatique en arrière-plan.")
      .setStartIcon(CardService.newIconImage()
        .setIconUrl("https://www.gstatic.com/images/icons/material/system/2x/info_googblue_48dp.png")));

  // Section de configuration principale
  const formSection = CardService.newCardSection()
    .setHeader("Règles de filtrage et destination")
    .addWidget(CardService.newTextInput()
      .setFieldName("query")
      .setTitle("Requête Gmail (ex: is:unread)")
      .setHint("Astuce : utilisez 'is:unread' pour cibler les nouveaux messages.")
      .setValue(props.getProperty("query") || ""))
    .addWidget(CardService.newTextInput()
      .setFieldName("email")
      .setTitle("Adresse email de destination")
      .setHint("L'adresse doit être validée dans Gmail > Paramètres > Transfert et POP/IMAP.")
      .setValue(props.getProperty("email") || ""))
    .addWidget(CardService.newTextInput()
      .setFieldName("message")
      .setTitle("Message d'accompagnement (Optionnel)")
      .setMultiline(true)
      .setValue(props.getProperty("message") || ""));

  // Section pour les boutons d'action
  const actionSection = CardService.newCardSection()
    .addWidget(CardService.newButtonSet()
      .addButton(CardService.newTextButton()
        .setText("Enregistrer")
        .setOnClickAction(CardService.newAction().setFunctionName("saveSettings"))
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED))
      .addButton(CardService.newTextButton()
        .setText("▶ Lancer maintenant")
        .setOnClickAction(CardService.newAction().setFunctionName("runTransferNow"))
        .setTextButtonStyle(CardService.TextButtonStyle.TEXT)))
    .addWidget(CardService.newTextButton()
      .setText("⛔ Désactiver tout")
      .setOnClickAction(CardService.newAction().setFunctionName("disableAll"))
      .setTextButtonStyle(CardService.TextButtonStyle.TEXT));

  // --- Section Tableau de bord ---
  const scriptProps = PropertiesService.getScriptProperties();
  const processedIds = getProcessedIds();
  const totalProcessed = processedIds.length;
  const lastRun = scriptProps.getProperty(CONFIG.LAST_RUN_KEY) || "Jamais";
  const lastCount = scriptProps.getProperty(CONFIG.LAST_COUNT_KEY) || "0";
  const currentQuery = props.getProperty("query");
  const currentEmail = props.getProperty("email");

  const statusSection = CardService.newCardSection()
    .setHeader("Tableau de bord")
    .addWidget(CardService.newDecoratedText()
      .setTopLabel("Configuration active")
      .setText(currentQuery && currentEmail
        ? `<font color="#1e8e3e"><b>Activée :</b></font> ${currentQuery} → ${currentEmail}`
        : `<font color="#d93025"><i>Non configuré</i></font>`)
      .setWrapText(true)
      .setStartIcon(CardService.newIconImage()
        .setIconUrl("https://www.gstatic.com/images/icons/material/system/2x/settings_googblue_48dp.png")))
    .addWidget(CardService.newDecoratedText()
      .setTopLabel("Messages transférés (total)")
      .setText(`<b>${totalProcessed}</b> message(s) en mémoire`)
      .setStartIcon(CardService.newIconImage()
        .setIconUrl("https://www.gstatic.com/images/icons/material/system/2x/check_circle_googgreen_48dp.png")))
    .addWidget(CardService.newDecoratedText()
      .setTopLabel("Dernière exécution")
      .setText(`${lastRun}  •  ${lastCount} transféré(s)`)
      .setStartIcon(CardService.newIconImage()
        .setIconUrl("https://www.gstatic.com/images/icons/material/system/2x/schedule_grey600_48dp.png")))
    .addWidget(CardService.newDecoratedText()
      .setTopLabel("Déclencheur automatique")
      .setText(isTriggerActive_()
        ? `<font color="#1e8e3e"><b>Actif</b></font> — toutes les ${CONFIG.TRIGGER_INTERVAL_MIN} min`
        : `<font color="#d93025"><b>Inactif</b></font> — enregistrez pour activer`)
      .setStartIcon(CardService.newIconImage()
        .setIconUrl("https://www.gstatic.com/images/icons/material/system/2x/timer_googblue_48dp.png")))
    .addWidget(CardService.newTextButton()
      .setText("Voir l'historique détaillé")
      .setOnClickAction(CardService.newAction().setFunctionName("showHistoryCard"))
      .setTextButtonStyle(CardService.TextButtonStyle.TEXT));

  return CardService.newCardBuilder()
    .setHeader(header)
    .addSection(infoSection)
    .addSection(formSection)
    .addSection(actionSection)
    .addSection(statusSection)
    .build();
}

/**
 * Enregistre les variables saisies par l'utilisateur
 */
function saveSettings(e) {
  try {
    const values = e.formInput;
    
    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (values.email && !emailRegex.test(values.email)) {
      return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification()
          .setText("Erreur : Adresse email invalide.")
          .setType(CardService.NotificationType.ERROR))
        .build();
    }

    const props = PropertiesService.getUserProperties();
    
    // Enregistrement avec des valeurs par défaut si vide
    props.setProperty("query", (values.query || "").trim());
    props.setProperty("email", (values.email || "").trim());
    props.setProperty("message", (values.message || "").trim());

    // Créer ou supprimer le trigger selon l'état de la config
    const configValid = (values.query || "").trim() && (values.email || "").trim();
    let statusMsg;

    if (configValid) {
      ensureTrigger_();
      statusMsg = "Configuration enregistrée — transfert automatique activé !";
    } else {
      removeTriggers_("processTransfer");
      statusMsg = "Configuration enregistrée — déclencheur désactivé.";
    }

    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText(statusMsg))
      .build();
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("Erreur lors de l'enregistrement.")
        .setType(CardService.NotificationType.ERROR))
      .build();
  }
}

/**
 * Désactive tout : supprime la configuration, le trigger et l'historique
 */
function disableAll() {
  try {
    // Supprimer la configuration utilisateur
    const props = PropertiesService.getUserProperties();
    props.deleteProperty("query");
    props.deleteProperty("email");
    props.deleteProperty("message");

    // Supprimer le trigger
    removeTriggers_("processTransfer");

    // Supprimer l'historique
    const scriptProps = PropertiesService.getScriptProperties();
    scriptProps.deleteProperty(CONFIG.PROCESSED_IDS_KEY);
    scriptProps.deleteProperty(CONFIG.LAST_RUN_KEY);
    scriptProps.deleteProperty(CONFIG.LAST_COUNT_KEY);

    // Rafraîchir la carte
    const updatedCard = buildSettingsCard();
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().updateCard(updatedCard))
      .setNotification(CardService.newNotification()
        .setText("Tout a été désactivé et réinitialisé."))
      .build();
  } catch (error) {
    console.error("Erreur lors de la désactivation:", error);
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("Erreur lors de la désactivation.")
        .setType(CardService.NotificationType.ERROR))
      .build();
  }
}

/**
 * Bouton "Lancer maintenant" — exécute le transfert et notifie l'utilisateur
 */
function runTransferNow() {
  try {
    const result = processTransfer();
    // Rafraîchir la carte pour mettre à jour le tableau de bord
    const updatedCard = buildSettingsCard();
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().updateCard(updatedCard))
      .setNotification(CardService.newNotification()
        .setText(result.count > 0
          ? `${result.count} message(s) transféré(s) avec succès !`
          : "Aucun nouveau message à transférer."))
      .build();
  } catch (error) {
    console.error("Erreur lors de l'exécution manuelle:", error);
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("Erreur lors du transfert. Consultez les logs.")
        .setType(CardService.NotificationType.ERROR))
      .build();
  }
}

// ============================================================
//  CARTE HISTORIQUE DÉTAILLÉ
// ============================================================

/**
 * Affiche la carte d'historique (navigation push)
 */
function showHistoryCard() {
  const card = buildHistoryCard();
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card))
    .build();
}

/**
 * Construit une carte affichant les derniers messages transférés
 */
function buildHistoryCard() {
  const header = CardService.newCardHeader()
    .setTitle("Historique des transferts")
    .setSubtitle("Derniers messages traités")
    .setImageUrl("https://www.gstatic.com/images/icons/material/system/2x/history_googblue_48dp.png")
    .setImageStyle(CardService.ImageStyle.CIRCLE);

  const processedIds = getProcessedIds();

  // Section statistiques
  const statsSection = CardService.newCardSection()
    .setHeader("Statistiques")
    .addWidget(CardService.newDecoratedText()
      .setTopLabel("Total en mémoire")
      .setText(`<b>${processedIds.length}</b> / ${CONFIG.MAX_STORED_IDS} max`)
      .setStartIcon(CardService.newIconImage()
        .setIconUrl("https://www.gstatic.com/images/icons/material/system/2x/database_googblue_48dp.png")))
    .addWidget(CardService.newTextButton()
      .setText("Réinitialiser l'historique")
      .setOnClickAction(CardService.newAction().setFunctionName("clearHistory"))
      .setTextButtonStyle(CardService.TextButtonStyle.TEXT));

  const cardBuilder = CardService.newCardBuilder()
    .setHeader(header)
    .addSection(statsSection);

  // Section des derniers messages (les 20 plus récents)
  if (processedIds.length > 0) {
    const recentIds = processedIds.slice(-20).reverse();
    const messagesSection = CardService.newCardSection()
      .setHeader(`Derniers messages (${Math.min(20, processedIds.length)} sur ${processedIds.length})`);

    recentIds.forEach(msgId => {
      try {
        const msg = GmailApp.getMessageById(msgId);
        if (msg) {
          messagesSection.addWidget(CardService.newDecoratedText()
            .setTopLabel(formatDate_(msg.getDate()))
            .setText(`<b>${truncate_(msg.getSubject(), 50)}</b>`)
            .setBottomLabel(`De : ${msg.getFrom()}`)
            .setWrapText(true));
        }
      } catch (e) {
        // Message supprimé ou inaccessible, on l'affiche tel quel
        messagesSection.addWidget(CardService.newDecoratedText()
          .setText(`<i>Message inaccessible</i>`)
          .setBottomLabel(`ID : ${msgId}`));
      }
    });

    cardBuilder.addSection(messagesSection);
  } else {
    cardBuilder.addSection(CardService.newCardSection()
      .addWidget(CardService.newDecoratedText()
        .setText("<i>Aucun transfert enregistré pour le moment.</i>")
        .setStartIcon(CardService.newIconImage()
          .setIconUrl("https://www.gstatic.com/images/icons/material/system/2x/inbox_grey600_48dp.png"))));
  }

  return cardBuilder.build();
}

/**
 * Réinitialise l'historique des messages traités
 */
function clearHistory() {
  PropertiesService.getScriptProperties().deleteProperty(CONFIG.PROCESSED_IDS_KEY);
  PropertiesService.getScriptProperties().deleteProperty(CONFIG.LAST_RUN_KEY);
  PropertiesService.getScriptProperties().deleteProperty(CONFIG.LAST_COUNT_KEY);

  const updatedCard = buildHistoryCard();
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(updatedCard))
    .setNotification(CardService.newNotification()
      .setText("Historique réinitialisé."))
    .build();
}

// ============================================================
//  UTILITAIRES
// ============================================================

/** Formate une date en français lisible */
function formatDate_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "dd/MM/yyyy à HH:mm");
}

/** Tronque une chaîne avec des points de suspension */
function truncate_(str, maxLen) {
  if (!str) return "(sans objet)";
  return str.length > maxLen ? str.substring(0, maxLen) + "…" : str;
}

// ============================================================
//  GESTION DU DÉCLENCHEUR TEMPOREL
// ============================================================

/**
 * Crée un déclencheur temporel pour processTransfer s'il n'existe pas déjà.
 * Évite les doublons en supprimant d'abord les triggers existants.
 */
function ensureTrigger_() {
  // Supprimer d'éventuels doublons
  removeTriggers_("processTransfer");

  ScriptApp.newTrigger("processTransfer")
    .timeBased()
    .everyMinutes(CONFIG.TRIGGER_INTERVAL_MIN)
    .create();

  console.log(`Trigger créé : processTransfer toutes les ${CONFIG.TRIGGER_INTERVAL_MIN} min.`);
}

/**
 * Supprime tous les triggers associés à une fonction donnée.
 */
function removeTriggers_(functionName) {
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === functionName) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

/**
 * Vérifie si un trigger est actif pour processTransfer.
 * Utilisé par le tableau de bord.
 */
function isTriggerActive_() {
  return ScriptApp.getProjectTriggers().some(
    trigger => trigger.getHandlerFunction() === "processTransfer"
  );
}

// ============================================================
//  SUIVI PAR MESSAGE INDIVIDUEL (résout le piège des threads)
// ============================================================

/**
 * Récupère l'ensemble des IDs de messages déjà traités.
 * Stockés en JSON dans ScriptProperties pour être partagés entre triggers.
 */
function getProcessedIds() {
  const raw = PropertiesService.getScriptProperties()
    .getProperty(CONFIG.PROCESSED_IDS_KEY);
  return raw ? JSON.parse(raw) : [];
}

/**
 * Sauvegarde les IDs traités en purgeant les plus anciens si nécessaire.
 */
function saveProcessedIds(ids) {
  // Garder uniquement les N derniers pour ne pas exploser le quota (9 KB/clé)
  const trimmed = ids.slice(-CONFIG.MAX_STORED_IDS);
  PropertiesService.getScriptProperties()
    .setProperty(CONFIG.PROCESSED_IDS_KEY, JSON.stringify(trimmed));
}

/**
 * Fonction principale de traitement.
 * À déclencher via un Trigger (ex: toutes les 15 ou 30 minutes)
 * ou manuellement via le bouton "Lancer maintenant".
 *
 * Retourne un objet { count } pour que l'appelant puisse notifier.
 */
function processTransfer() {
  const props = PropertiesService.getUserProperties();
  const query = props.getProperty("query");
  const forwardTo = props.getProperty("email");
  const bodyIntro = props.getProperty("message");

  // Vérification des prérequis
  if (!query || !forwardTo) {
    console.warn("Configuration incomplète. Arrêt du traitement.");
    return { count: 0 };
  }

  try {
    // Filtre temporel pour économiser du temps d'exécution (6 min max)
    const finalQuery = `${query} newer_than:7d`;
    const threads = GmailApp.search(finalQuery, 0, CONFIG.MAX_THREADS);

    if (threads.length === 0) {
      console.log("Aucun thread correspondant à la requête.");
      return { count: 0 };
    }

    // Charger les IDs déjà traités
    const processedIds = new Set(getProcessedIds());
    const newlyProcessedIds = [];

    // Formatage HTML du message d'introduction
    const htmlIntro = bodyIntro && bodyIntro.trim()
      ? `<div style="padding:10px;background-color:#f0f0f0;border-left:4px solid #4285f4;margin-bottom:15px;">${bodyIntro.trim().replace(/\n/g, '<br>')}</div>`
      : '';

    let messagesProcessedCount = 0;

    threads.forEach(thread => {
      thread.getMessages().forEach(msg => {
        const msgId = msg.getId();

        // Ignorer les messages déjà transférés (suivi individuel)
        if (processedIds.has(msgId)) return;

        try {
          msg.forward(forwardTo, {
            subject: `[Transfert] ${msg.getSubject().replace(/^\[Transfert\] /g, '')}`,
            htmlBody: `${htmlIntro}<div>--- <b>Message original de ${msg.getFrom()}</b> ---</div><br>${msg.getBody()}`
          });

          newlyProcessedIds.push(msgId);
          messagesProcessedCount++;
        } catch (forwardError) {
          console.error(`Erreur transfert message ${msgId}:`, forwardError);
        }
      });
    });

    // Persister les nouveaux IDs traités
    if (newlyProcessedIds.length > 0) {
      saveProcessedIds([...processedIds, ...newlyProcessedIds]);
    }

    // Sauvegarder les métadonnées du dernier run pour le tableau de bord
    const scriptProps = PropertiesService.getScriptProperties();
    scriptProps.setProperty(CONFIG.LAST_RUN_KEY,
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy à HH:mm"));
    scriptProps.setProperty(CONFIG.LAST_COUNT_KEY, String(messagesProcessedCount));

    console.log(`${messagesProcessedCount} message(s) transféré(s) dans ${threads.length} fil(s).`);
    return { count: messagesProcessedCount };

  } catch (error) {
    console.error("Erreur générale lors du traitement:", error);
    return { count: 0 };
  }
}