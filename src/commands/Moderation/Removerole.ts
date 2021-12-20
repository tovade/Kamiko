import { GuildMember, MessageEmbed, Role } from 'discord.js';

import Command from '../../lib/structures/Command';
import { DiscordClient } from '../../lib/structures/DiscordClient';
import { findMember, findRole } from '../../utils/functions';
import { IContext } from '../../utils/interfaces';

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'removerole',
            group: 'Moderation',
            description: 'remove a role from an user',
            examples: ['!removerole @tovade @Member '],
            context: {
                clientPermissions: ['MANAGE_ROLES'],
                permissions: ['MANAGE_ROLES']
            }
        })
    }
    async run(ctx: IContext) {
        const { args, message } = ctx
        const roleMention = findRole(message, args)
        if (!roleMention) {
            const embed = new MessageEmbed().setColor(this.client.config.color).setFooter(`© Kamiko`).setTitle('❌ Error').setDescription('You did not provide a role.')
            return message.channel.send({ embeds: [embed] })
        }
        args.shift()
        const memberMention = await findMember(message, args)
        if (!memberMention) {
            const embed = new MessageEmbed().setColor(this.client.config.color).setFooter(`© Kamiko`).setTitle('❌ Error').setDescription('You did not provide a member.')
            return message.channel.send({ embeds: [embed] })
        }
        this.client.moderator.removerole(ctx.message, roleMention as Role, memberMention as GuildMember)
    }
}
