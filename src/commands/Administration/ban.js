const { SlashCommandBuilder, messageLink, PermissionFlagsBits } = require("discord.js");
const { logMessage } = require("../../utils/logs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban d'un membre")
    .addMentionableOption((option) =>
        option
            .setName("membre")
            .setDescription("Le membre à ban")
            .setRequired(true)
    ).addStringOption((option) => 
            option 
                .setName("raison")
                .setDescription("Raison du ban")
    ),
    async execute(interaction) {
    if (!interaction.guild.members.cache.get(interaction.user.id).permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({content: 'Vous ne pouvez pas utiliser cette commande', ephemeral: true});

    targetUserId = interaction.options.get("membre").value;
    reason = interaction.options.get("raison")?.value || "Aucune raison référencée";

    await interaction.deferReply({ephemeral:true});

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("Cet utilisateur n'existe pas.");
      logMessage(interaction.client, `<@${interaction.user.id}> a tenté de ban <@${targetUserId}> pour *${reason}* mais n'a pas réussi !`);

      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "Vous ne pouvez pas ban le propriétaire du serveur."
      );
      logMessage(interaction.client, `<@${interaction.user.id}> a tenté de ban <@${targetUserId}> pour *${reason}* mais n'a pas réussi !`);

      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "Je ne peux pas ban cet utilisateur car il a un rôle égal ou plus élevé que vous"
      );
      logMessage(interaction.client, `<@${interaction.user.id}> a tenté de ban <@${targetUserId}> pour *${reason}* mais n'a pas réussi !`);

      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "Je ne peux pas ban cet utilisateur car il a un rôle égal ou plus élevé que vous"
      );
      logMessage(interaction.client, `<@${interaction.user.id}> a tenté de ban <@${targetUserId}> pour *${reason}* mais n'a pas réussi !`);
      return;
    }

    // Ban the targetUser
    try {
      await targetUser.ban({ reason });
      await interaction.editReply(
        `User ${targetUser} a été banni \nRaison : ${reason}`
      );
      logMessage(interaction.client, `<@${interaction.user.id}> a ban <@${targetUserId}> pour *${reason}*`);
    } catch (error) {
      console.log(`There was an error when banning: ${error}`);
      logMessage(interaction.client, `<@${interaction.user.id}> a tenté de ban <@${targetUserId}> pour *${reason}* mais n'a pas réussi !`);
    }
  },
};
