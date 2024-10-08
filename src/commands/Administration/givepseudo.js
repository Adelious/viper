const {
  SlashCommandBuilder,
  messageLink,
  PermissionFlagsBits,
} = require("discord.js");

const axios = require("axios");
const { logMessage } = require("../../utils/logs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("givepseudo")
    .setDescription("setup le nom rp de tlm sur le server"),
  async execute(interaction) {
    if (
      !interaction.guild.members.cache
        .get(interaction.user.id)
        .permissions.has(PermissionFlagsBits.Administrator)
    )
      return interaction.reply({
        content: "Vous ne pouvez pas utiliser cette commande",
        ephemeral: true,
      });

    // Changement de nom discord en le nom et prénom RP in game
    const apiURL = "https://api.simple-roleplay.fr/public/user.php";

    var nom;
    var guild = interaction.guild;

    logMessage(interaction.client, `<@${interaction.user.id}> a utilisé la commande /givepseudo`, ':green_square:');

    guild.members.cache.forEach(async (member) => {
        if(member.user.bot ) return;
        if(await member.nickname !== null) return await console.log(member.nickname + " à déjà un nom rp")

      try {
        const response = await axios.get(await apiURL, {
          params: {
            id: await member.id,
          },
        });

        if ( response &&  response.data) {
          const { name } = await response.data;
          await member.setNickname(name, "Renamed");
          nom = await name;
          logMessage(interaction.client, `<@${member.user.id}> a été renommé`, ':blue_square:')
        } else {
          await member.setNickname("Pas de nom RP.", "Renamed");
          logMessage(interaction.client, `<@${member.user.id}> a été renommé`, ':blue_square:')
        }
      } catch (error) {
        await console.error(
          await member.user.id + " | " + member.user.username + " | Error occurred while fetching data from the API : L'utilisateur n'a pas d'identifiants discord associé ou ");
      }
    });

    await interaction.reply({content: "Commande executée avec succès", ephemeral: true})
  },
};
