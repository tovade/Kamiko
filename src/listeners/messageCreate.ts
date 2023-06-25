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
        if (command?.info.preconditions && command?.info.preconditions.length > 0) {
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
        var addCooldown = false
        const now = Date.now()
        const timestamps = this.client.registry.getCooldownTimestamps(command?.info.name as string)
        const cooldownAmount = command?.info.cooldown ? command.info.cooldown * 1000 : 0
        if (command?.info.cooldown) {
            if (timestamps.has(message.author.id)) {
                const currentTime = timestamps.get(message.author.id)
                if (!currentTime) return

                const expirationTime = currentTime + cooldownAmount
                if (now < expirationTime) {
                    return await message.channel
                        ?.createMessage({
                            embeds: [
                                new KamikoEmbed()
                                    .addDefaults(this.client)
                                    .setTitle('⏰ Calm Down')
                                    .setDescription(`${message.author.mention}, you can run this command <t:${Math.floor(new Date(expirationTime).getTime() / 1000)}:R>.`)
                                    .toJSON()
                            ]
                        })
                        .then(msg =>
                            setTimeout(async () => {
                                await msg.delete().catch(() => {})
                                await message.delete().catch(() => {})
                            }, 12000)
                        )
                }
            }
            addCooldown = true
        }
        if (!command) return
        command.preMessageRun(message, args)
        if (addCooldown) {
            timestamps.set(message.author.id, now)
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
        }
    }
}
