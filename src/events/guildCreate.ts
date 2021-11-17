import { Guild, GuildMember, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from 'discord.js'

import { DiscordClient } from '../lib/structures/DiscordClient'
import Event from '../lib/structures/Event'

export default class GuildCreate extends Event {
    constructor(client: DiscordClient) {
        super(client, 'guildCreate')
    }

    async run(guild: Guild) {
        await this.sendLogs(guild)
        await this.sendMessage(guild)
    }
    async sendLogs(guild: Guild) {
        const owner = await guild.fetchOwner()
        const embed = new MessageEmbed()
            .setTitle('Joined A New Server')
            .setColor('GREEN')
            .setThumbnail(guild.iconURL() as string)
            .setDescription("Hey Developer Look! I've Joined A New Server !!")
            .addField('**Server Name**', guild.name, true)
            .addField('**Server ID**', guild.id, true)
            .addField('**Owner**', `Tag - ${owner.user.tag}\nID - ${owner.id}`, true)
            .addField('**Members**', `${guild.memberCount} `, true)
        ;(this.client.channels.cache.get('909510786387419176') as TextChannel).send({ embeds: [embed] })
    }
    async sendMessage(guild: Guild) {
        const invite = new MessageButton()
            .setLabel('Bot Invite')
            .setStyle('LINK')
            .setEmoji('598173448543666187')
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=904321999302717500&permissions=0&scope=bot`)

        const server = new MessageButton().setLabel('Support Server').setStyle('LINK').setEmoji('598166880271859712').setURL('https://discord.gg/e9bYSySh5k')

        const row = new MessageActionRow().addComponents(invite, server)
        const channeltosend = guild.channels.cache.find(
            ch => ch.type === 'GUILD_TEXT' && ch.permissionsFor(guild.members.cache.get(this.client.user?.id as string) as GuildMember).has(['SEND_MESSAGES', 'EMBED_LINKS'])
        )
        if (!channeltosend) return
        ;(channeltosend as TextChannel).send({
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `**Thanks for adding me to your server!**\n\n*My prefix is:* \`${(await this.client.databases.guilds.get(guild.id)).prefix}\`\n\n*To get started type* \`${
                            (await this.client.databases.guilds.get(guild.id)).prefix
                        }help\` *to see my commands*\n\n*If you have any questions or need help make sure to join the support server*`
                    )
                    .setColor(this.client.config.color)
            ],
            components: [row]
        })
    }
}
