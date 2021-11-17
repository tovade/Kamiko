import { Guild, MessageEmbed, TextChannel } from 'discord.js'

import { DiscordClient } from '../lib/structures/DiscordClient'
import Event from '../lib/structures/Event'

export default class GuildCreate extends Event {
    constructor(client: DiscordClient) {
        super(client, 'guildDelete')
    }

    async run(guild: Guild) {
        await this.sendMessage(guild)
    }
    async sendMessage(guild: Guild) {
        const owner = await guild.fetchOwner()
        const embed = new MessageEmbed()
            .setTitle('Left a Server')
            .setColor('RED')
            .setThumbnail(guild.iconURL() as string)
            .setDescription('I have left a Server server.')
            .addField('**Server Name**', guild.name, true)
            .addField('**Server ID**', guild.id, true)
            .addField('**Owner**', `Tag - ${owner.user.tag}\nID - ${owner.id}`, true)
            .addField('**Members**', `${guild.memberCount}`, true)
        ;(this.client.channels.cache.get('909510786387419176') as TextChannel).send({ embeds: [embed] })
    }
}
