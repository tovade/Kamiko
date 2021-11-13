import { Message } from 'discord.js'

import CommandHandler from '../classes/CommandHandler'
import { DiscordClient } from '../lib/structures/DiscordClient'
import Event from '../lib/structures/Event'

export default class MessageEvent extends Event {
    constructor(client: DiscordClient) {
        super(client, 'messageCreate')
    }

    async run(message: Message) {
        if (message.author.bot) return
        await CommandHandler.handleCommand(this.client, message)
    }
}
