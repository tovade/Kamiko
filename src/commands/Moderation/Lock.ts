import { GuildMember, TextChannel } from 'discord.js';

import Command from '../../lib/structures/Command';
import { DiscordClient } from '../../lib/structures/DiscordClient';
import { IContext } from '../../utils/interfaces';

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'lock',
            group: 'Moderation',
            description: 'Lock a channel.',
            examples: ['!lock '],
            context: {
                clientPermissions: ['MANAGE_MESSAGES'],
                permissions: ['MANAGE_MESSAGES'],
                channel: true
            }
        })
    }
    async run(ctx: IContext) {
        this.client.moderator.lock(ctx.message, ctx.mentions.channel as TextChannel)
    }
}
