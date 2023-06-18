import { AnyTextableChannel, Message, Uncached } from 'oceanic.js'

import { KamikoClient } from '../lib/KamikoClient'
import Listener from '../lib/structures/Listener'

export default class MessageCreateListener extends Listener<'messageCreate'> {
    constructor(client: KamikoClient) {
        super(client, {
            name: 'messageCreate',
            type: 'on'
        })
    }
    async run(message: Message<AnyTextableChannel | Uncached>) {
        if (message.author.bot) return
        const prefix = await this.client.fetchPrefix(message)
        if (!message.content.startsWith(prefix)) return
        const [commandName, ...args] = message.content.slice(prefix.length).trim().split(/ +/g)
        const command = this.client.registry.commands.find(c => c.info.name === commandName)
        if (!command) return
        command.preMessageRun(message, args)
    }
}
