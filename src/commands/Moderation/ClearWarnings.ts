import { GuildMember, MessageEmbed, Snowflake } from 'discord.js';

import { WarnClient } from '../../lib/mod/ModClient';
import Command from '../../lib/structures/Command';
import { DiscordClient } from '../../lib/structures/DiscordClient';
import { IContext } from '../../utils/interfaces';

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'clearwarnings',
            group: 'Moderation',
            description: 'Clear all the warnings from an user.',
            examples: ['!clearwarnings @tovados'],
            aliases: ['clearwarns'],
            context: {
                permissions: ['MANAGE_NICKNAMES'],
                member: true
            }
        })
    }
    async run(ctx: IContext) {
        const data = await this.client.warnClient.clear(ctx.message.guildId as Snowflake, ctx.mentions.member?.id as Snowflake)
        const embed = new MessageEmbed()
            .setColor(this.client.config.color)
            .setAuthor(ctx.message.member?.displayName as string)
            .setDescription(`Cleared all warnings for \`${ctx.mentions.member?.displayName}\``)
            .setTitle('Warning')
            .setFooter('© Kamiko')
        ctx.message.channel.send({
            embeds: [embed]
        })
    }
}
