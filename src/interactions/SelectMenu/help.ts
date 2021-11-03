import { MessageEmbed, SelectMenuInteraction, Interaction } from 'discord.js';
import DiscordClient from '../../structures/DiscordClient';
import SelectMenu from '../../structures/SelectMenuInteraction';
export default class HelpSelectMenu extends SelectMenu {
    constructor(client: DiscordClient) {
        super(client, 'HELP_CATEGORIES');
    }
    async run(interaction: Interaction) {
        handleCategories(interaction as SelectMenuInteraction, this.client);
    }
}

export function handleCategories(interaction: SelectMenuInteraction, bot: DiscordClient) {
    const category = interaction.values.toString();
    const commands =
        bot.registry.commands
            .filter(c => c.info.group === interaction.values.toString())
            .map(c => ' ' + `\`${c.info.name}\``)
            .toString()
            .trim() || '-';

    const embed = new MessageEmbed().setTitle(`${category} commands`).setDescription(commands);

    interaction.reply({
        ephemeral: true,
        embeds: [embed]
    });
}
