import { Guild, MessageEmbed } from 'discord.js';
import { IContext } from '../../utils/interfaces';
const moment = require('moment');
const verificationLevels = {
    NONE: 'None',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    VERY_HIGH: 'Very High'
};
import Command from '../../structures/Command';
import DiscordClient from '../../structures/DiscordClient';

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'serverinfo',
            group: 'Information',
            description: 'Get serverinfo',
            aliases: ['server', 'guild', 'guildinfo'],
            cooldown: 6
        });
    }

    async run(ctx: IContext) {
        const { message } = ctx;
        const guild = message.guild as Guild;

        let members = guild.members.cache;
        if (!members) {
            members = await guild.members.fetch();
        }
        const botSize = members.filter(member => member.user.bot).size;

        const userSize = guild.memberCount - botSize;

        const channels = guild.channels.cache;

        const emojis = guild.emojis.cache;

        const createdAt = moment(message.guild?.createdTimestamp).format('LLLL');

        const owner = await guild.fetchOwner();
        const server_embed = new MessageEmbed({
            title: `:desktop: SERVER INFORMATION :desktop:`,
            fields: [
                { name: 'Server name', value: `\`\`\`${guild.name}\`\`\``, inline: true },
                { name: 'Server owner', value: `\`\`\`${owner.user.tag}\`\`\``, inline: true },
                { name: `Server members [${guild.memberCount}]`, value: `\`\`\`🙂 Members: ${userSize} | 🤖 Bots: ${botSize}\`\`\``, inline: false },
                { name: `Server ID`, value: `\`\`\`${guild.id}\`\`\``, inline: true },
                { name: 'Verification level', value: `\`\`\`${verificationLevels[guild.verificationLevel]}\`\`\``, inline: true },
                {
                    name: `Server categories and channels [${channels.size}]`,
                    value: `\`\`\`Categories : ${channels.filter(channel => channel.type === 'GUILD_CATEGORY').size} | Text : ${
                        channels.filter(channel => channel.type === 'GUILD_TEXT').size
                    } | Voice: ${channels.filter(channel => channel.type === 'GUILD_VOICE').size} | Announcement: ${
                        channels.filter(channel => channel.type === 'GUILD_NEWS').size
                    } | Stage: ${channels.filter(channel => channel.type === 'GUILD_STAGE_VOICE').size} | Store: ${
                        channels.filter(channel => channel.type === 'GUILD_STORE').size
                    }\`\`\``,
                    inline: false
                },
                {
                    name: `Server emojis [${emojis.size}]`,
                    value: `\`\`\`Normal: ${emojis.filter(emoji => !emoji.animated).size} | Animated: ${emojis.filter(emoji => emoji.animated!).size}
                \`\`\``,
                    inline: false
                },
                {
                    name: 'Server boost level',
                    value: `\`\`\`${guild.premiumTier || '0'}\`\`\``,
                    inline: true
                },
                {
                    name: "Server boost's",
                    value: `\`\`\`${guild.premiumSubscriptionCount || '0'}\`\`\``,
                    inline: true
                },
                {
                    name: 'Created At',
                    value: `\`\`\`${createdAt}\`\`\``,
                    inline: false
                }
            ],
            thumbnail: {
                url: guild.iconURL()!
            },
            footer: {
                text: '© Kamiko'
            },
            color: this.client.config.color
        });
        return message.channel.send({ embeds: [server_embed] });
    }
}
