import { KamikoClient } from 'lib/KamikoClient'
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

            if (cmd.interactionRun) {
                cmd.interactionRun(interaction)
            }
        }
    }
}
