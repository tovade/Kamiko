import { Interaction } from 'discord.js'
import { DiscordClient } from './DiscordClient'

export default abstract class SelectMenu {
    /**
     * Discord client.
     */
    readonly client: DiscordClient
    /**
     * The name of the menu
     */
    readonly name: string

    constructor(client: DiscordClient, name: string) {
        this.client = client
        this.name = name
    }
    abstract run(interaction: Interaction): Promise<any>
}
