import { IContext } from '../../utils/interfaces'
import Command from '../../lib/structures/Command'
import { DiscordClient } from '../../lib/structures/DiscordClient'
import { CommandInteraction } from 'discord.js'

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'ping',
            group: 'General',
            description: 'Ping command.',
            cooldown: 5,
            type: 'BOTH'
        })
    }

    async run(ctx: IContext) {
        await ctx.message.reply(`My ping is \`${this.client.ws.ping}ms\``)
    }
    async runSlash(interaction: CommandInteraction) {
        interaction.reply({ content: `My ping is \`${this.client.ws.ping}ms\`` })
    }
}
