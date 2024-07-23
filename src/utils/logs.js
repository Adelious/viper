const { logChannelId } = require("../config.json");

/**
 * Fonction pour envoyer un message de log dans un canal spécifique
 * @param {string} logMessage - Le message de log à envoyer
 * @returns {Promise<void>}
 */
async function logMessage(client, logMessage) {
    if (!logMessage) {
        throw new Error("Le message de log ne peut pas être vide.");
    }

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    const formattedLog = `${formattedTime} : ${logMessage}`;

    // Vérification de client et logChannel
    if (!client) {
        throw new Error("Le client Discord n'est pas défini.");
    }

    const logChannel = client.channels.cache.get(logChannelId);

    if (logChannel && logChannel.isTextBased()) {
        await logChannel.send(formattedLog);
    } else {
        throw new Error("Le canal de log spécifié n'est pas valide.");
    }
}

module.exports = { logMessage };
