import chroma from 'chroma-js'
import { CommandInteraction, MessageEmbed } from 'discord.js'

import Command from '../../lib/structures/Command'
import { DiscordClient } from '../../lib/structures/DiscordClient'
import { IContext } from '../../utils/interfaces'

export default class ColorCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'color',
            group: 'Utility',
            description: 'Get info about a color.',
            examples: ['!color red'],
            context: {
                args: 1
            },
            type: 'BOTH',
            slashOptions: [
                {
                    name: 'color',
                    description: 'The color to get information on',
                    type: 'STRING',
                    required: true
                }
            ]
        })
    }

    async run(ctx: IContext) {
        const { message, args } = ctx
        const color = chroma(args.getAll()[0])

        const preview = `https://api.no-api-key.com/api/v2/color?hex=${color.hex().split('#')[1]}`

        const embed = new MessageEmbed({
            footer: {
                text: '© Kamiko'
            },
            color: this.client.config.color,
            fields: [
                {
                    name: 'Hex:',
                    value: color.hex()
                },
                { name: 'RGB:', value: `rgb(${color.rgb().join(', ')})` },
                { name: 'RGBA:', value: `rgba(${color.rgba().join(', ')})` }
            ],
            thumbnail: {
                url: preview
            },
            timestamp: Date.now()
        })
        message.channel.send({
            embeds: [embed]
        })
    }
    async runSlash(interaction: CommandInteraction) {
        const color = chroma(interaction.options.getString('color', true))

        const preview = `https://api.no-api-key.com/api/v2/color?hex=${color.hex().split('#')[1]}`

        const embed = new MessageEmbed({
            footer: {
                text: '© Kamiko'
            },
            color: this.client.config.color,
            fields: [
                {
                    name: 'Hex:',
                    value: color.hex()
                },
                { name: 'RGB:', value: `rgb(${color.rgb().join(', ')})` },
                { name: 'RGBA:', value: `rgba(${color.rgba().join(', ')})` }
            ],
            thumbnail: {
                url: preview
            },
            timestamp: Date.now()
        })
        interaction.reply({
            embeds: [embed]
        })
    }
}
