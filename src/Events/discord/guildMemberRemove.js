const { Events, ActivityType } = require('discord.js');
const { byeChannelID } = require("../../config.json");

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
            // Message d'au revoir
            if (byeChannelID !== "") {
            channel = await member.guild.channels.cache.get(byeChannelID);
            await channel.send(
                `\:wave: A bientôt **<@${member.user.id}>** dans la **Viper**`
            );
        }
	},
};
