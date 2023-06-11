import { GuildMember, TextChannel } from 'discord.js'

import Command from '../../lib/structures/Command'
import { DiscordClient } from '../../lib/structures/DiscordClient'
import { IContext } from '../../utils/interfaces'

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'slowmode',
            group: 'Moderation',
            description: 'add slowmode to a channel.',
            examples: ['!slowmode 20 '],
            context: {
                clientPermissions: ['MANAGE_MESSAGES'],
                permissions: ['MANAGE_MESSAGES'],
                args: 1
            }
        })
    }
    async run(ctx: IContext) {
        this.client.moderator.slowmode(ctx.message, parseInt(ctx.args.getAll()[0]))
    }
}
