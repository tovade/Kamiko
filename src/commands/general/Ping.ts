import { KamikoClient } from 'lib/KamikoClient'
import { Args } from 'lib/structures/Args'
import Command from 'lib/structures/Command'
import { KamikoEmbed } from 'lib/structures/KamikoEmbed'
import { AnyTextableChannel, Message, Uncached } from 'oceanic.js'

export default class PingCommand extends Command {
    constructor(client: KamikoClient) {
        super(client, {
            name: 'ping',
            description: 'Pong!',
            group: 'General'
        })
    }
    run(message: Message<AnyTextableChannel | Uncached>, args: Args) {
        message.channel?.createMessage({
            embeds: [
                new KamikoEmbed()
                    .setTitle('Pong!')
                    .addDefaults(this.client)
                    .setDescription(`**Latency:** ${message?.guild ? message.guild?.shard.latency : this.client.shards.first()?.latency}ms`)
                    .toJSON()
            ]
        })
    }
}
