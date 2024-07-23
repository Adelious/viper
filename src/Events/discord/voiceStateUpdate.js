const { Events, ChannelType } = require('discord.js');
const { autoVocChanneld, voiceCategoryId } = require("../../config.json");
const { logMessage } = require('../../utils/logs.js');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        if (newState.channelId === autoVocChanneld) {
            const member = newState.member;

            const channel = await newState.guild.channels.create({
                name: `・Vocal de ${(member.nickname !== null) ? member.nickname : member.user.username}`,
                type: ChannelType.GuildVoice,
            });

            await channel.setParent(voiceCategoryId);
            await member.voice.setChannel(channel);
        }

        if (oldState.channel && oldState.channel.name.startsWith("・") && oldState.channel.members.size === 0) {
            oldState.channel.delete();
        }

        // Partie pour les logs
        if (newState.channel && !oldState.channel) {
            await logMessage(oldState.client, `${newState.member.displayName} a rejoint le salon <#${newState.channel.id}>`);
        }

        if (!newState.channel && oldState.channel) {
            await logMessage(oldState.client, `${oldState.member.displayName} a quitté le salon <#${oldState.channel.id}>`);
        }

        if (newState.channel && oldState.channel) {
            if (newState.channel.id !== oldState.channel.id) {
                await logMessage(oldState.client, `${newState.member.displayName} a quitté le salon <#${oldState.channel.id}> et a rejoint <#${newState.channel.id}>`);
            } else {
                await logMessage(oldState.client, `${newState.member.displayName} est toujours dans le salon <#${oldState.channel.id}> mais il y a eu des changements. (mute, partage ...)`);
            }
        }
    },
};
