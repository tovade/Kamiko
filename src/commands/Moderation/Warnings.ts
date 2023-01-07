import { GuildMember, MessageEmbed, Snowflake } from 'discord.js';

import { WarnClient } from '../../lib/mod/ModClient';
import Command from '../../lib/structures/Command';
import { DiscordClient } from '../../lib/structures/DiscordClient';
import { IContext } from '../../utils/interfaces';

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'warnings',
            group: 'Moderation',
            description: 'Get the warnings from an user.',
            examples: ['!warnings @tovados'],
            context: {
                permissions: ['MANAGE_NICKNAMES'],
                member: true
            }
        })
    }
    async run(ctx: IContext) {
        const warnings = await this.client.warnClient.get(ctx.message.guildId as Snowflake, ctx.mentions.member?.id as Snowflake)
        let embed
        if (warnings) {
            embed = new MessageEmbed()
                .setColor(this.client.config.color)
                .setTitle('Warnings')
                .setDescription(
                    `${warnings.content.map((w: any, i: any) => `**ID:** ${w.id}\n**Moderator:** ${w.moderatorTAG}\n**Date:** ${w.date}\n**Reason:** ${w.reason}\n`).join(' ')}`
                )
                .setFooter('© Kamiko')
        } else if (!warnings || !warnings.length) {
            embed = new MessageEmbed().setColor(this.client.config.color).setTitle('Warnings').setDescription('This user has no warnings.').setFooter('© Kamiko')
        }
        ctx.message.channel.send({
            embeds: [embed as MessageEmbed]
        })
    }
}
