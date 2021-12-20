import { GuildMember, MessageEmbed, Snowflake } from 'discord.js';

import { WarnClient } from '../../lib/mod/ModClient';
import Command from '../../lib/structures/Command';
import { DiscordClient } from '../../lib/structures/DiscordClient';
import { IContext } from '../../utils/interfaces';

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'warn',
            group: 'Moderation',
            description: 'Warn an user.',
            examples: ['!warn @tovados'],
            context: {
                permissions: ['MANAGE_NICKNAMES'],
                member: true
            }
        })
    }
    async run(ctx: IContext) {
        let reason = ctx.args.join(' ')
        if (!reason) reason = 'Not provided'
        const data = await this.client.warnClient.add(
            ctx.message.guildId as Snowflake,
            ctx.mentions.member?.id as Snowflake,
            {
                reason
            },
            ctx.message.member as GuildMember
        )
        const embed = new MessageEmbed()
            .setColor(this.client.config.color)
            .setAuthor(ctx.message.member?.displayName as string)
            .setDescription(`Warned ${ctx.mentions.member?.displayName}\nReason: ${reason}\n Moderator: ${ctx.message.member?.displayName} ||${ctx.message.member?.id}||`)
            .setTitle('Warning')
            .setFooter('© Kamiko')
        ctx.message.channel.send({
            embeds: [embed]
        })
    }
}
