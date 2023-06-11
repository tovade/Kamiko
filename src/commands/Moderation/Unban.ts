import { GuildMember } from 'discord.js'

import Command from '../../lib/structures/Command'
import { DiscordClient } from '../../lib/structures/DiscordClient'
import { IContext } from '../../utils/interfaces'

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'unban',
            group: 'Moderation',
            description: 'unBan a user.',
            examples: ['!unban @joe yes'],
            context: {
                clientPermissions: ['BAN_MEMBERS'],
                permissions: ['BAN_MEMBERS'],
                args: 1
            }
        })
    }
    async run(ctx: IContext) {
        const reason = ctx.args.getAll().slice(1).join(' ')
        const id = ctx.args.getAll()[0]
        await this.client.moderator.unban(ctx.message, id, reason)
    }
}
