import { Interaction } from 'discord.js';

import { DiscordClient } from '../lib/structures/DiscordClient';
import Event from '../lib/structures/Event';

export default class InteractionEvent extends Event {
    constructor(client: DiscordClient) {
        super(client, 'interactionCreate')
    }

    async run(interaction: Interaction) {
        if (interaction.isSelectMenu()) {
            const menu = this.client.registry.findMenu(interaction.customId)
            if (!menu) return
            await menu.run(interaction)
        }
        if (interaction.isCommand()) {
            if (!interaction.inGuild()) return

            const cmd = this.client.registry.commands.get(interaction.options.getSubcommand(true) as string)
            try {
                if (cmd?.runSlash) cmd?.runSlash(interaction)
            } catch {
                interaction.reply({
                    content: 'Something went terribly wrong!',
                    ephemeral: true
                })
            }
        }
    }
}
