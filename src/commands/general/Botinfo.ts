import { stripIndent } from 'common-tags'
import { CommandInteraction, Interaction, MessageEmbed } from 'discord.js'
import moment from 'moment'
import { cpu, mem, os } from 'node-os-utils'

import Command from '../../lib/structures/Command'
import { DiscordClient } from '../../lib/structures/DiscordClient'
import { IContext } from '../../utils/interfaces'

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'botinfo',
            group: 'General',
            description: 'Get information about the bot.',
            cooldown: 5,
            type: 'BOTH'
        })
    }

    async run(ctx: IContext) {
        const d = moment.duration(this.client.uptime)
        const days = d.days() == 1 ? `${d.days()} Day` : `${d.days()} Days`
        const hours = d.hours() == 1 ? `${d.hours()} Hour` : `${d.hours()} Hours`
        const clientStats = stripIndent`
        Servers      :: ${this.client.guilds.cache.size}
        Users        :: ${this.client.users.cache.size}
        Channels     :: ${this.client.channels.cache.size}
        Ping         :: ${Math.round(this.client.ws.ping)}ms
        Uptime       :: ${days} and ${hours}
        Commands     :: ${this.client.registry.commands.size}
        Events       :: ${this.client.registry.events.size} 
        `
        const { totalMemMb } = await mem.info()
        const serverStats = stripIndent`
        OS           :: ${await os.oos()}
        CPU          :: ${cpu.model()}
        Cores        :: ${cpu.count()}
        Cpu Usage    :: ${await cpu.usage()} %
        Memory       :: ${Math.round(totalMemMb)} MB
        Memory Usage :: ${Math.round(process.memoryUsage().heapTotal / 1000000)} MB     
        `

        const embed = new MessageEmbed()
            .setTitle('My statistics')
            .addField('Client', `\`\`\`asciidoc\n${clientStats}\`\`\``)
            .addField('Host', `\`\`\`asciidoc\n${serverStats}\`\`\``)
            .addField('Invite me', `[Kamiko](https://discord.com/api/oauth2/authorize?client_id=904321999302717500&permissions=0&scope=bot)`)
            .setTimestamp()
            .setColor('BLURPLE')

        ctx.message.channel.send({ embeds: [embed] })
    }
    async runSlash(interaction: CommandInteraction): Promise<any> {
        const d = moment.duration(this.client.uptime)
        const days = d.days() == 1 ? `${d.days()} Day` : `${d.days()} Days`
        const hours = d.hours() == 1 ? `${d.hours()} Hour` : `${d.hours()} Hours`
        const clientStats = stripIndent`
        Servers      :: ${this.client.guilds.cache.size}
        Users        :: ${this.client.users.cache.size}
        Channels     :: ${this.client.channels.cache.size}
        Ping         :: ${Math.round(this.client.ws.ping)}ms
        Uptime       :: ${days} and ${hours}
        Commands     :: ${this.client.registry.commands.size}
        Events       :: ${this.client.registry.events.size} 
        `
        const { totalMemMb } = await mem.info()
        const serverStats = stripIndent`
        OS           :: ${await os.oos()}
        CPU          :: ${cpu.model()}
        Cores        :: ${cpu.count()}
        Cpu Usage    :: ${await cpu.usage()} %
        Memory       :: ${Math.round(totalMemMb)} MB
        Memory Usage :: ${Math.round(process.memoryUsage().heapTotal / 1000000)} MB     
        `

        const embed = new MessageEmbed()
            .setTitle('My statistics')
            .addField('Client', `\`\`\`asciidoc\n${clientStats}\`\`\``)
            .addField('Host', `\`\`\`asciidoc\n${serverStats}\`\`\``)
            .addField('Invite me', `[Kamiko](https://discord.com/api/oauth2/authorize?client_id=904321999302717500&permissions=0&scope=bot)`)
            .setTimestamp()
            .setColor('BLURPLE')

        interaction.reply({ embeds: [embed] })
    }
}
