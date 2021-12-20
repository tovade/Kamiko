import { GuildMember } from 'discord.js';

import Command from '../../lib/structures/Command';
import { DiscordClient } from '../../lib/structures/DiscordClient';
import { IContext } from '../../utils/interfaces';

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'kick',
            group: 'Moderation',
            description: 'Kick a user.',
            examples: ['!kick @joe yes'],
            context: {
                clientPermissions: ['KICK_MEMBERS'],
                permissions: ['KICK_MEMBERS'],
                member: true
            }
        })
    }
    async run(ctx: IContext) {
        const reason = ctx.args.slice(0).join(' ')
        const member = ctx.mentions.member
        this.client.moderator.kick(ctx.message, member as GuildMember, reason)
    }
}
