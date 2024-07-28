const { Events, ActivityType } = require('discord.js');
require("dotenv").config();
const { logMessage } = require("../../utils/logs");

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		await client.user.setPresence({
			activities: [{
				name: 'Simple Roleplay',
				type: ActivityType.Playing,
			}],
			status: 'dnd',
		  })
		  
		  let guild = client.guilds.cache.get(process.env.GUILD_ID)

		  await guild.commands.fetch()
		    .then(commands => {
				var commandList = [];
				commands.forEach(command => {
					commandList.push(command.name);
				});
				console.table(commandList);
			})
		    .catch(console.error);

			await console.log(`Ready! Logged in as ${client.user.tag}`);

			logMessage(client, "**BOT OPPERATIONNEL** !", ':blue_square:');
	},
};
