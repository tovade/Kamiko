import { GuildMember } from 'discord.js'

import Command from '../../lib/structures/Command'
import { DiscordClient } from '../../lib/structures/DiscordClient'
import { IContext } from '../../utils/interfaces'

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'clear',
            group: 'Moderation',
            description: 'Purge messages.',
            examples: ['!purge 100'],
            context: {
                clientPermissions: ['MANAGE_MESSAGES'],
                permissions: ['MANAGE_MESSAGES'],
                args: 1
            }
        })
    }
    async run(ctx: IContext) {
        const amount = ctx.args.getAll()[0]
        this.client.moderator.clear(ctx.message, amount)
    }
}
