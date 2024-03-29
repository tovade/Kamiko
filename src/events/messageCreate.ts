import { Message } from 'discord.js'

import CommandHandler from '../classes/CommandHandler'
import { DiscordClient } from '../lib/structures/DiscordClient'
import Event from '../lib/structures/Event'

export default class MessageEvent extends Event {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'messageCreate',
            type: 'on'
        })
    }

    async run(message: Message) {
        if (message.author.bot || message.channel.type === 'DM') return
        await CommandHandler.handleCommand(this.client, message)
    }
}
