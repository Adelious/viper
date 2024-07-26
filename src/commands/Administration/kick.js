const { SlashCommandBuilder, messageLink, PermissionFlagsBits } = require("discord.js");
const { logMessage } = require("../../utils/logs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("kick d'un membre")
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
      logMessage(interaction.client, `<@${interaction.user.id}> a tenté de kcik <@${targetUserId}> pour *${reason}* mais n'a pas réussi !`);

      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "Vous ne pouvez pas kick le propriétaire du serveur."
      );
      logMessage(interaction.client, `<@${interaction.user.id}> a tenté de kcik <@${targetUserId}> pour *${reason}* mais n'a pas réussi !`);

      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "Je ne peux pas kick un utilisateur de même ou de rôle suppérieur"
      );
      logMessage(interaction.client, `<@${interaction.user.id}> a tenté de kcik <@${targetUserId}> pour *${reason}* mais n'a pas réussi !`);

      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "Je ne peux pas kick un utilisateur de même ou de rôle suppérieur"
      );
      logMessage(interaction.client, `<@${interaction.user.id}> a tenté de kcik <@${targetUserId}> pour *${reason}* mais n'a pas réussi !`);

      return;
    }

    // Kick the targetUser
    try {
      await targetUser.kick({ reason });
      await interaction.editReply(
        `L'utilisateur ${targetUser} a été kick\nRaison: ${reason}`
      );
      logMessage(interaction.client, `<@${interaction.user.id}> a kcik <@${targetUserId}> pour *${reason}*`);

    } catch (error) {
      console.log(`There was an error when kicking: ${error}`);
      logMessage(interaction.client, `<@${interaction.user.id}> a tenté de kcik <@${targetUserId}> pour *${reason}* mais n'a pas réussi !`);

    }
  },
};
