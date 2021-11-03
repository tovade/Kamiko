import { Interaction } from 'discord.js';

import DiscordClient from '../structures/DiscordClient';
import Event from '../structures/Event';

export default class InteractionEvent extends Event {
    constructor(client: DiscordClient) {
        super(client, 'interactionCreate');
    }

    async run(interaction: Interaction) {
        if (interaction.isSelectMenu()) {
            const menu = this.client.registry.findMenu(interaction.customId);
            if (!menu) return;
            await menu.run(interaction);
        }
    }
}
