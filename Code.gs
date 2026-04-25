/**
 * Constantes pour l'application
 */
const CONFIG = {
  MAX_THREADS: 50,
  PROCESSED_IDS_KEY: "processedMessageIds",
  MAX_STORED_IDS: 500,
  LAST_RUN_KEY: "lastRunDate",
  LAST_COUNT_KEY: "lastRunCount",
  TRIGGER_INTERVAL_HOURS: 1,
  RULES_KEY: "rules",
  MAX_RULES: 10
};

// ============================================================
//  STOCKAGE DES RÈGLES
// ============================================================

/** Récupère les règles. Migre l'ancien format mono-règle si nécessaire. */
function getRules_() {
  const props = PropertiesService.getUserProperties();
  const raw = props.getProperty(CONFIG.RULES_KEY);
  if (raw) return JSON.parse(raw);

  // Migration de l'ancien format
  const oldQuery = props.getProperty("query");
  const oldEmail = props.getProperty("email");
  if (oldQuery && oldEmail) {
    const migrated = [{
      id: "r_" + Date.now(),
      query: oldQuery,
      email: oldEmail,
      message: props.getProperty("message") || "",
      enabled: true
    }];
    saveRules_(migrated);
    props.deleteProperty("query");
    props.deleteProperty("email");
    props.deleteProperty("message");
    return migrated;
  }
  return [];
}

/** Sauvegarde les règles en JSON dans UserProperties */
function saveRules_(rules) {
  PropertiesService.getUserProperties()
    .setProperty(CONFIG.RULES_KEY, JSON.stringify(rules));
}

/** Trouve une règle par ID */
function findRule_(ruleId) {
  return getRules_().find(r => r.id === ruleId) || null;
}

// ============================================================
//  CARTE PRINCIPALE — LISTE DES RÈGLES
// ============================================================

function buildSettingsCard() {
  const rules = getRules_();
  const scriptProps = PropertiesService.getScriptProperties();
  const totalProcessed = getProcessedIds().length;
  const lastRun = scriptProps.getProperty(CONFIG.LAST_RUN_KEY) || "Jamais";
  const lastCount = scriptProps.getProperty(CONFIG.LAST_COUNT_KEY) || "0";

  const header = CardService.newCardHeader()
    .setTitle("Automatisation Gmail")
    .setSubtitle(`${rules.length} règle(s) configurée(s)`)
    .setImageUrl("https://www.gstatic.com/images/icons/material/system/2x/forward_to_inbox_googblue_48dp.png")
    .setImageStyle(CardService.ImageStyle.CIRCLE);

  // Section liste des règles
  const rulesSection = CardService.newCardSection()
    .setHeader("Règles de transfert");

  if (rules.length === 0) {
    rulesSection.addWidget(CardService.newDecoratedText()
      .setText("<i>Aucune règle configurée.</i>")
      .setStartIcon(CardService.newIconImage()
        .setIconUrl("https://www.gstatic.com/images/icons/material/system/2x/inbox_grey600_48dp.png")));
  } else {
    rules.forEach(rule => {
      const statusIcon = rule.enabled
        ? "https://www.gstatic.com/images/icons/material/system/2x/check_circle_googgreen_48dp.png"
        : "https://www.gstatic.com/images/icons/material/system/2x/pause_circle_grey600_48dp.png";
      const statusText = rule.enabled
        ? `<font color="#1e8e3e"><b>Active</b></font>`
        : `<font color="#9e9e9e"><b>En pause</b></font>`;

      rulesSection.addWidget(CardService.newDecoratedText()
        .setTopLabel(`${statusText} — ${truncate_(rule.query, 35)}`)
        .setText(`→ ${rule.email}`)
        .setWrapText(true)
        .setStartIcon(CardService.newIconImage().setIconUrl(statusIcon))
        .setButton(CardService.newTextButton()
          .setText("✏️")
          .setOnClickAction(CardService.newAction()
            .setFunctionName("showEditRuleCard")
            .setParameters({"ruleId": rule.id}))));
    });
  }

  // Bouton ajouter
  if (rules.length < CONFIG.MAX_RULES) {
    rulesSection.addWidget(CardService.newTextButton()
      .setText("+ Ajouter une règle")
      .setOnClickAction(CardService.newAction().setFunctionName("showNewRuleCard"))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED));
  }

  // Section actions globales
  const actionSection = CardService.newCardSection()
    .addWidget(CardService.newButtonSet()
      .addButton(CardService.newTextButton()
        .setText("▶ Lancer maintenant")
        .setOnClickAction(CardService.newAction().setFunctionName("runTransferNow"))
        .setTextButtonStyle(CardService.TextButtonStyle.TEXT))
      .addButton(CardService.newTextButton()
        .setText("⛔ Tout désactiver")
        .setOnClickAction(CardService.newAction().setFunctionName("disableAll"))
        .setTextButtonStyle(CardService.TextButtonStyle.TEXT)));

  // Section tableau de bord
  const activeCount = rules.filter(r => r.enabled).length;
  const statusSection = CardService.newCardSection()
    .setHeader("Tableau de bord")
    .addWidget(CardService.newDecoratedText()
      .setTopLabel("Règles actives")
      .setText(`<b>${activeCount}</b> / ${rules.length}`)
      .setStartIcon(CardService.newIconImage()
        .setIconUrl("https://www.gstatic.com/images/icons/material/system/2x/settings_googblue_48dp.png")))
    .addWidget(CardService.newDecoratedText()
      .setTopLabel("Messages transférés")
      .setText(`<b>${totalProcessed}</b> en mémoire`)
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
        ? `<font color="#1e8e3e"><b>Actif</b></font> — toutes les ${CONFIG.TRIGGER_INTERVAL_HOURS}h`
        : `<font color="#d93025"><b>Inactif</b></font>`)
      .setStartIcon(CardService.newIconImage()
        .setIconUrl("https://www.gstatic.com/images/icons/material/system/2x/timer_googblue_48dp.png")))
    .addWidget(CardService.newTextButton()
      .setText("Voir l'historique détaillé")
      .setOnClickAction(CardService.newAction().setFunctionName("showHistoryCard"))
      .setTextButtonStyle(CardService.TextButtonStyle.TEXT));

  return CardService.newCardBuilder()
    .setHeader(header)
    .addSection(rulesSection)
    .addSection(actionSection)
    .addSection(statusSection)
    .build();
}

// ============================================================
//  CARTE ÉDITION D'UNE RÈGLE
// ============================================================

function showNewRuleCard() {
  const card = buildEditRuleCard_(null);
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card))
    .build();
}

function showEditRuleCard(e) {
  const ruleId = e.parameters.ruleId;
  const card = buildEditRuleCard_(ruleId);
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card))
    .build();
}

function buildEditRuleCard_(ruleId) {
  const rule = ruleId ? findRule_(ruleId) : null;
  const isNew = !rule;

  const header = CardService.newCardHeader()
    .setTitle(isNew ? "Nouvelle règle" : "Modifier la règle")
    .setImageUrl("https://www.gstatic.com/images/icons/material/system/2x/edit_googblue_48dp.png")
    .setImageStyle(CardService.ImageStyle.CIRCLE);

  const formSection = CardService.newCardSection()
    .addWidget(CardService.newTextInput()
      .setFieldName("query")
      .setTitle("Requête Gmail (ex: is:unread)")
      .setHint("Astuce : utilisez 'is:unread' pour cibler les nouveaux messages.")
      .setValue(rule ? rule.query : ""))
    .addWidget(CardService.newTextInput()
      .setFieldName("email")
      .setTitle("Adresse email de destination")
      .setHint("L'adresse doit être validée dans Gmail > Paramètres > Transfert et POP/IMAP.")
      .setValue(rule ? rule.email : ""))
    .addWidget(CardService.newTextInput()
      .setFieldName("message")
      .setTitle("Message d'accompagnement (Optionnel)")
      .setMultiline(true)
      .setValue(rule ? rule.message : ""));

  // Toggle activé/désactivé (uniquement pour les règles existantes)
  if (!isNew) {
    formSection.addWidget(CardService.newDecoratedText()
      .setTopLabel("Statut")
      .setText(rule.enabled ? "Active" : "En pause")
      .setSwitchControl(CardService.newSwitch()
        .setFieldName("enabled")
        .setValue("true")
        .setSelected(rule.enabled)));
  }

  // Boutons
  const saveAction = CardService.newAction()
    .setFunctionName("saveRule")
    .setParameters({"ruleId": ruleId || ""});

  const actionSection = CardService.newCardSection()
    .addWidget(CardService.newButtonSet()
      .addButton(CardService.newTextButton()
        .setText("Enregistrer")
        .setOnClickAction(saveAction)
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)));

  // Bouton supprimer (uniquement pour les règles existantes)
  if (!isNew) {
    actionSection.addWidget(CardService.newTextButton()
      .setText("🗑️ Supprimer cette règle")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("showConfirmDeleteCard")
        .setParameters({"ruleId": ruleId}))
      .setTextButtonStyle(CardService.TextButtonStyle.TEXT));
  }

  return CardService.newCardBuilder()
    .setHeader(header)
    .addSection(formSection)
    .addSection(actionSection)
    .build();
}

// ============================================================
//  SAUVEGARDE / SUPPRESSION D'UNE RÈGLE
// ============================================================

function saveRule(e) {
  try {
    const values = e.formInput || {};
    const ruleId = e.parameters.ruleId;

    const query = (values.query || "").trim();
    const email = (values.email || "").trim();

    if (!query || !email) {
      return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification()
          .setText("Erreur : la requête et l'email sont requis.")
          .setType(CardService.NotificationType.ERROR))
        .build();
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification()
          .setText("Erreur : Adresse email invalide.")
          .setType(CardService.NotificationType.ERROR))
        .build();
    }

    const rules = getRules_();
    const message = (values.message || "").trim();

    if (ruleId) {
      // Modification
      const idx = rules.findIndex(r => r.id === ruleId);
      if (idx !== -1) {
        rules[idx].query = query;
        rules[idx].email = email;
        rules[idx].message = message;
        // Le switch renvoie "true" si coché, absent sinon
        rules[idx].enabled = (values.enabled === "true");
      }
    } else {
      // Création
      rules.push({
        id: "r_" + Date.now(),
        query: query,
        email: email,
        message: message,
        enabled: true
      });
    }

    saveRules_(rules);
    updateTriggerState_(rules);

    const updatedCard = buildSettingsCard();
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().popToRoot().updateCard(updatedCard))
      .setNotification(CardService.newNotification()
        .setText(ruleId ? "Règle mise à jour !" : "Nouvelle règle créée !"))
      .build();
  } catch (error) {
    console.error("Erreur saveRule:", error);
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("Erreur : " + error.message)
        .setType(CardService.NotificationType.ERROR))
      .build();
  }
}

// ============================================================
//  CONFIRMATION DE SUPPRESSION
// ============================================================

function showConfirmDeleteCard(e) {
  const ruleId = e.parameters.ruleId;
  const rule = findRule_(ruleId);

  const header = CardService.newCardHeader()
    .setTitle("Confirmer la suppression")
    .setImageUrl("https://www.gstatic.com/images/icons/material/system/2x/warning_googyellow_48dp.png")
    .setImageStyle(CardService.ImageStyle.CIRCLE);

  const infoSection = CardService.newCardSection()
    .addWidget(CardService.newDecoratedText()
      .setTopLabel("Règle à supprimer")
      .setText(rule ? `<b>${rule.query}</b> → ${rule.email}` : "<i>Introuvable</i>")
      .setWrapText(true));

  const actionSection = CardService.newCardSection()
    .addWidget(CardService.newButtonSet()
      .addButton(CardService.newTextButton()
        .setText("Oui, supprimer")
        .setOnClickAction(CardService.newAction()
          .setFunctionName("deleteRule")
          .setParameters({"ruleId": ruleId}))
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED))
      .addButton(CardService.newTextButton()
        .setText("Annuler")
        .setOnClickAction(CardService.newAction().setFunctionName("cancelDelete"))
        .setTextButtonStyle(CardService.TextButtonStyle.TEXT)));

  const card = CardService.newCardBuilder()
    .setHeader(header)
    .addSection(infoSection)
    .addSection(actionSection)
    .build();

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card))
    .build();
}

function deleteRule(e) {
  try {
    const ruleId = e.parameters.ruleId;
    let rules = getRules_().filter(r => r.id !== ruleId);
    saveRules_(rules);
    updateTriggerState_(rules);

    const updatedCard = buildSettingsCard();
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().popToRoot().updateCard(updatedCard))
      .setNotification(CardService.newNotification().setText("Règle supprimée."))
      .build();
  } catch (error) {
    console.error("Erreur deleteRule:", error);
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("Erreur : " + error.message)
        .setType(CardService.NotificationType.ERROR))
      .build();
  }
}

function cancelDelete() {
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().popCard())
    .build();
}

// ============================================================
//  ACTIONS GLOBALES
// ============================================================

function disableAll() {
  try {
    const rules = getRules_().map(r => ({ ...r, enabled: false }));
    saveRules_(rules);
    removeTriggers_("processTransfer");

    const scriptProps = PropertiesService.getScriptProperties();
    scriptProps.deleteProperty(CONFIG.PROCESSED_IDS_KEY);
    scriptProps.deleteProperty(CONFIG.LAST_RUN_KEY);
    scriptProps.deleteProperty(CONFIG.LAST_COUNT_KEY);

    const updatedCard = buildSettingsCard();
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().updateCard(updatedCard))
      .setNotification(CardService.newNotification()
        .setText("Toutes les règles ont été mises en pause."))
      .build();
  } catch (error) {
    console.error("Erreur disableAll:", error);
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("Erreur : " + error.message)
        .setType(CardService.NotificationType.ERROR))
      .build();
  }
}

function runTransferNow() {
  try {
    const result = processTransfer();
    const updatedCard = buildSettingsCard();
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().updateCard(updatedCard))
      .setNotification(CardService.newNotification()
        .setText(result.count > 0
          ? `${result.count} message(s) transféré(s) !`
          : "Aucun nouveau message à transférer."))
      .build();
  } catch (error) {
    console.error("Erreur runTransferNow:", error);
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("Erreur : " + error.message)
        .setType(CardService.NotificationType.ERROR))
      .build();
  }
}

// ============================================================
//  CARTE HISTORIQUE
// ============================================================

function showHistoryCard() {
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(buildHistoryCard()))
    .build();
}

function buildHistoryCard() {
  const header = CardService.newCardHeader()
    .setTitle("Historique des transferts")
    .setSubtitle("Derniers messages traités")
    .setImageUrl("https://www.gstatic.com/images/icons/material/system/2x/history_googblue_48dp.png")
    .setImageStyle(CardService.ImageStyle.CIRCLE);

  const processedIds = getProcessedIds();

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
      } catch (err) {
        messagesSection.addWidget(CardService.newDecoratedText()
          .setText("<i>Message inaccessible</i>")
          .setBottomLabel(`ID : ${msgId}`));
      }
    });
    cardBuilder.addSection(messagesSection);
  } else {
    cardBuilder.addSection(CardService.newCardSection()
      .addWidget(CardService.newDecoratedText()
        .setText("<i>Aucun transfert enregistré.</i>")
        .setStartIcon(CardService.newIconImage()
          .setIconUrl("https://www.gstatic.com/images/icons/material/system/2x/inbox_grey600_48dp.png"))));
  }

  return cardBuilder.build();
}

function clearHistory() {
  const sp = PropertiesService.getScriptProperties();
  sp.deleteProperty(CONFIG.PROCESSED_IDS_KEY);
  sp.deleteProperty(CONFIG.LAST_RUN_KEY);
  sp.deleteProperty(CONFIG.LAST_COUNT_KEY);

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(buildHistoryCard()))
    .setNotification(CardService.newNotification().setText("Historique réinitialisé."))
    .build();
}

// ============================================================
//  UTILITAIRES
// ============================================================

function formatDate_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "dd/MM/yyyy à HH:mm");
}

function truncate_(str, maxLen) {
  if (!str) return "(sans objet)";
  return str.length > maxLen ? str.substring(0, maxLen) + "…" : str;
}

/** Active ou désactive le trigger selon le nombre de règles actives */
function updateTriggerState_(rules) {
  const hasActive = rules.some(r => r.enabled);
  if (hasActive) {
    ensureTrigger_();
  } else {
    removeTriggers_("processTransfer");
  }
}

// ============================================================
//  GESTION DU DÉCLENCHEUR TEMPOREL
// ============================================================

function ensureTrigger_() {
  removeTriggers_("processTransfer");
  ScriptApp.newTrigger("processTransfer")
    .timeBased()
    .everyHours(CONFIG.TRIGGER_INTERVAL_HOURS)
    .create();
  console.log(`Trigger créé : toutes les ${CONFIG.TRIGGER_INTERVAL_HOURS}h.`);
}

function removeTriggers_(functionName) {
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === functionName) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function isTriggerActive_() {
  return ScriptApp.getProjectTriggers().some(
    t => t.getHandlerFunction() === "processTransfer"
  );
}

// ============================================================
//  SUIVI PAR MESSAGE INDIVIDUEL
// ============================================================

function getProcessedIds() {
  const raw = PropertiesService.getScriptProperties()
    .getProperty(CONFIG.PROCESSED_IDS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveProcessedIds(ids) {
  const trimmed = ids.slice(-CONFIG.MAX_STORED_IDS);
  PropertiesService.getScriptProperties()
    .setProperty(CONFIG.PROCESSED_IDS_KEY, JSON.stringify(trimmed));
}

// ============================================================
//  TRAITEMENT PRINCIPAL — MULTI-RÈGLES
// ============================================================

/**
 * Itère sur toutes les règles actives et transfère les messages.
 * Retourne { count } pour la notification.
 */
function processTransfer() {
  const rules = getRules_().filter(r => r.enabled);

  if (rules.length === 0) {
    console.warn("Aucune règle active.");
    return { count: 0 };
  }

  try {
    const processedIds = new Set(getProcessedIds());
    const newlyProcessedIds = [];
    let totalCount = 0;

    rules.forEach(rule => {
      try {
        const finalQuery = `${rule.query} newer_than:7d`;
        const threads = GmailApp.search(finalQuery, 0, CONFIG.MAX_THREADS);

        const htmlIntro = rule.message && rule.message.trim()
          ? `<div style="padding:10px;background-color:#f0f0f0;border-left:4px solid #4285f4;margin-bottom:15px;">${rule.message.trim().replace(/\n/g, '<br>')}</div>`
          : '';

        threads.forEach(thread => {
          thread.getMessages().forEach(msg => {
            const msgId = msg.getId();
            if (processedIds.has(msgId)) return;

            try {
              msg.forward(rule.email, {
                subject: `[Transfert] ${msg.getSubject().replace(/^\[Transfert\] /g, '')}`,
                htmlBody: `${htmlIntro}<div>--- <b>Message original de ${msg.getFrom()}</b> ---</div><br>${msg.getBody()}`
              });
              newlyProcessedIds.push(msgId);
              processedIds.add(msgId);
              totalCount++;
            } catch (fwdErr) {
              console.error(`Erreur transfert ${msgId} (règle ${rule.id}):`, fwdErr);
            }
          });
        });
      } catch (ruleErr) {
        console.error(`Erreur règle ${rule.id} (${rule.query}):`, ruleErr);
      }
    });

    if (newlyProcessedIds.length > 0) {
      saveProcessedIds([...getProcessedIds(), ...newlyProcessedIds]);
    }

    const scriptProps = PropertiesService.getScriptProperties();
    scriptProps.setProperty(CONFIG.LAST_RUN_KEY,
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy à HH:mm"));
    scriptProps.setProperty(CONFIG.LAST_COUNT_KEY, String(totalCount));

    console.log(`${totalCount} message(s) transféré(s) pour ${rules.length} règle(s).`);
    return { count: totalCount };

  } catch (error) {
    console.error("Erreur générale processTransfer:", error);
    return { count: 0 };
  }
}