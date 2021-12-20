import { GuildMember } from 'discord.js';

import Command from '../../lib/structures/Command';
import { DiscordClient } from '../../lib/structures/DiscordClient';
import { IContext } from '../../utils/interfaces';

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'ban',
            group: 'Moderation',
            description: 'Ban a user.',
            examples: ['!ban @joe yes'],
            context: {
                clientPermissions: ['BAN_MEMBERS'],
                permissions: ['BAN_MEMBERS'],
                member: true
            }
        })
    }
    async run(ctx: IContext) {
        const reason = ctx.args.slice(0).join(' ')
        const member = ctx.mentions.member
        this.client.moderator.ban(ctx.message, member as GuildMember, reason)
    }
}
