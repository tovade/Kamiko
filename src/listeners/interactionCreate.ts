import { KamikoClient } from 'lib/KamikoClient'
import { KamikoEmbed } from 'lib/structures/KamikoEmbed'
import Listener from 'lib/structures/Listener'
import { AnyInteractionGateway, InteractionTypes } from 'oceanic.js'

export default class InteractionListener extends Listener<'interactionCreate'> {
    constructor(client: KamikoClient) {
        super(client, {
            name: 'interactionCreate',
            type: 'on'
        })
    }
    run(interaction: AnyInteractionGateway) {
        if (interaction.type === InteractionTypes.APPLICATION_COMMAND) {
            const cmd = this.client.registry.findCommand(interaction.data.options.getSubCommand(false)?.[0] as string)

            if (!cmd) return

            if (cmd?.info.preconditions) {
                for (const condition of cmd.info.preconditions) {
                    const cond = this.client.registry.conditions.find(p => p.name === condition)
                    if (!cond) return
                    const result = cond?.interactionRun(interaction)

                    if (result.isErr()) {
                        return interaction.createMessage({
                            embeds: [new KamikoEmbed().addDefaults(this.client).setTitle('Woah! Error time.').setDescription(result.unwrapErr()).toJSON()]
                        })
                    }
                    if (result.isOk()) {
                        continue
                    }
                }
            }

            if (cmd.interactionRun) {
                cmd.interactionRun(interaction)
            }
        }
    }
}
