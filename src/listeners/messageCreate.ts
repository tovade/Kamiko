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
    run(message: Message<AnyTextableChannel | Uncached>) {
        if (message.author.bot) return
        if (!message.content.startsWith('a!')) return
        const [commandName, ...args] = message.content.slice('a!'.length).trim().split(/ +/g)
        const command = this.client.registry.commands.find(c => c.info.name === commandName)
        if (!command) return
        command.preMessageRun(message, args)
    }
}
