import { DiscordClient } from './DiscordClient'

export abstract class Helper {
    client: DiscordClient
    name: string

    constructor(bot: DiscordClient, name: string) {
        this.client = bot
        this.name = name

        this.execute = this.execute.bind(this)
    }

    abstract execute(): Promise<any>
}
