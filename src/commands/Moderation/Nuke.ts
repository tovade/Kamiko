import { GuildMember, TextChannel } from 'discord.js';

import Command from '../../lib/structures/Command';
import { DiscordClient } from '../../lib/structures/DiscordClient';
import { IContext } from '../../utils/interfaces';

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'nuke',
            group: 'Moderation',
            description: 'nuke a channel.',
            examples: ['!nuke 20 '],
            context: {
                clientPermissions: ['MANAGE_CHANNELS'],
                permissions: ['MANAGE_CHANNELS'],
                channel: true
            }
        })
    }
    async run(ctx: IContext) {
        this.client.moderator.nuke(ctx.message, ctx.mentions.channel as TextChannel)
    }
}
