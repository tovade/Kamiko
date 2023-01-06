import { CommandInteraction } from 'discord.js';

import Command from '../../lib/structures/Command';
import { DiscordClient } from '../../lib/structures/DiscordClient';
import { IContext } from '../../utils/interfaces';

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
        await ctx.message.reply({
            embeds: [
                {
                    color: 'DARK_BLUE',
                    description: `**Latency:** \`${this.client.ws.ping}ms (${(this.client.ws.ping % 60000) / 1000}s)\`\n**Database Latency:** \`${await this.getDBPing(ctx)}ms\``,
                    footer: {
                        text: '© Kamiko'
                    }
                }
            ]
        })
    }
    async runSlash(interaction: CommandInteraction) {
        interaction.reply({
            embeds: [
                {
                    color: 'DARK_BLUE',
                    description: `**Latency:** \`${this.client.ws.ping}ms (${(this.client.ws.ping % 60000) / 1000}s)\`\n**Database Latency:** \`${await this.getDBInteractionPing(
                        interaction
                    )}ms\``,
                    footer: {
                        text: '© Kamiko'
                    }
                }
            ]
        })
    }
    async getDBPing(ctx: IContext) {
        let dataPing = Date.now()
        await this.client.databases.guilds.repository.findOne({ id: (ctx.message.guild as any).id })
        let dataPingNow = Date.now()
        return dataPingNow - dataPing
    }
    async getDBInteractionPing(interaction: CommandInteraction) {
        let dataPing = Date.now()
        await this.client.databases.guilds.repository.findOne({ id: (interaction.guild as any).id })
        let dataPingNow = Date.now()
        return dataPingNow - dataPing
    }
}
