import { GuildMember, MessageEmbed, Snowflake } from 'discord.js'

import { WarnClient } from '../../lib/mod/ModClient'
import Command from '../../lib/structures/Command'
import { DiscordClient } from '../../lib/structures/DiscordClient'
import { IContext } from '../../utils/interfaces'

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'unwarn',
            group: 'Moderation',
            description: 'UnWarn an user.',
            examples: ['!unwarn @tovados 1'],
            aliases: ['delwarn', 'delete-warning', 'rem-warn'],
            context: {
                permissions: ['MANAGE_NICKNAMES'],
                member: true,
                args: 1
            }
        })
    }
    async run(ctx: IContext) {
        let warnID = ctx.args.getAll()[0]
        const data = await this.client.warnClient.remove(ctx.message.guildId as Snowflake, ctx.mentions.member?.id as Snowflake, warnID)
        let embed
        if (data) {
            embed = new MessageEmbed()
                .setColor(this.client.config.color)
                .setAuthor(ctx.message.member?.displayName as string)
                .setDescription('Successfully removed a warning with the ID: ' + warnID)
                .setTitle('Warning')
                .setFooter('© Kamiko')
        } else {
            embed = new MessageEmbed()
                .setColor(this.client.config.color)
                .setAuthor(ctx.message.member?.displayName as string)
                .setDescription('This user has no warnings or you provided the wrong warn ID')
                .setTitle('Warning')
                .setFooter('© Kamiko')
        }
        ctx.message.channel.send({
            embeds: [embed]
        })
    }
}
