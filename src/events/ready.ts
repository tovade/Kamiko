import Logger from '../classes/Logger'
import { DiscordClient } from '../lib/structures/DiscordClient'
import Event from '../lib/structures/Event'
import { InitDatabase } from '../lib/structures/DatabaseConnection'
export default class ReadyEvent extends Event {
    constructor(client: DiscordClient) {
        super(client, 'ready')
    }

    async run() {
        InitDatabase.Init(this.client)
        Logger.log('SUCCESS', `Logged in as "${this.client.user?.tag}".`)
        this.client.user?.setActivity({ name: 'Who is more retarted.', type: 'COMPETING' })
    }
}
