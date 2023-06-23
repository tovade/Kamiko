import { KamikoEmbed } from 'lib/structures/KamikoEmbed'
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
        if (command?.info.preconditions) {
            for (const condition of command.info.preconditions) {
                const cond = this.client.registry.conditions.find(p => p.name === condition)
                if (!cond) return
                const result = cond?.messageRun(message)

                if (result.isErr()) {
                    return message.channel?.createMessage({
                        embeds: [new KamikoEmbed().addDefaults(this.client).setTitle('Woah! Error time.').setDescription(result.unwrapErr()).toJSON()]
                    })
                }
                if (result.isOk()) {
                    continue
                }
            }
        }
        if (!command) return
        command.preMessageRun(message, args)
    }
}
