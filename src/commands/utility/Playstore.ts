import { CommandInteraction, MessageEmbed } from 'discord.js'
import PlayStore, { IAppItem } from 'google-play-scraper'

import Command from '../../lib/structures/Command'
import { DiscordClient } from '../../lib/structures/DiscordClient'
import { IContext } from '../../utils/interfaces'

export default class PlayStoreCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'playstore',
            group: 'Utility',
            description: 'Search an app on the playstore',
            cooldown: 5,
            type: 'BOTH',
            examples: ['playstore discord'],
            slashOptions: [
                {
                    name: 'app',
                    description: 'The app you want to search for',
                    type: 'STRING',
                    required: true
                }
            ],
            context: {
                args: 1
            }
        })
    }

    async run(ctx: IContext) {
        let data: IAppItem[]
        try {
            data = await PlayStore.search({
                term: `${ctx.args.getAll().join(' ')}`,
                num: 1
            })
        } catch (error) {
            return ctx.message.reply({ content: 'App not found.' })
        }

        let app: IAppItem

        try {
            app = JSON.parse(JSON.stringify(data[0]))
        } catch (error) {
            return ctx.message.reply({ content: 'App not found.' })
        }
        const embed = new MessageEmbed()
            .setTitle(app.title)
            .setAuthor(app.developer)
            .setThumbnail(app.icon)
            .setURL(app.url)
            .setDescription(truncate(app.summary, 250))
            .addFields([
                {
                    name: 'Price',
                    value: (app as any).price === 0 ? 'Free' : (app as any).price
                },
                {
                    name: 'Rating',
                    value: app.scoreText
                }
            ])
        return ctx.message.reply({ embeds: [embed] })
    }
    async runSlash(interaction: CommandInteraction) {
        await interaction.deferReply()
        let data: IAppItem[]
        try {
            data = await PlayStore.search({
                term: `${interaction.options.getString('app') as string}`,
                num: 1
            })
        } catch (error) {
            return interaction.editReply({ content: 'App not found.' })
        }

        let app: IAppItem

        try {
            app = JSON.parse(JSON.stringify(data[0]))
        } catch (error) {
            return interaction.editReply({ content: 'App not found.' })
        }
        const embed = new MessageEmbed()
            .setTitle(app.title)
            .setAuthor(app.developer)
            .setThumbnail(app.icon)
            .setURL(app.url)
            .setDescription(truncate(app.summary, 250))
            .addFields([
                {
                    name: 'Price',
                    value: (app as any).price === 0 ? 'Free' : (app as any).price
                },
                {
                    name: 'Rating',
                    value: `${app.scoreText}/5`
                }
            ])
        return interaction.editReply({ embeds: [embed] })
    }
}
function truncate(str: string, maxlength: number) {
    return str.length > maxlength ? str.slice(0, maxlength - 1) + '…' : str
}
