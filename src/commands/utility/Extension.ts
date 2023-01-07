import { ColorResolvable, MessageEmbed } from 'discord.js';

import Command from '../../lib/structures/Command';
import { DiscordClient } from '../../lib/structures/DiscordClient';
import { IContext } from '../../utils/interfaces';

const EXTENSION_URL = 'https://marketplace.visualstudio.com/items/'

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'extension',
            group: 'Utility',
            aliases: ['ext', 'visualstudiocode', 'vscode'],
            description: 'Find a visual studio extension.',
            cooldown: 5,
            type: 'MESSAGE',
            context: {
                args: 1
            }
        })
    }

    async run(ctx: IContext) {
        ctx.message.channel.sendTyping()
        const resultsAll = await this.findExtension(ctx)
        const results = resultsAll.slice(0, 10)

        if (!results)
            return ctx.message.channel.send({
                embeds: [
                    {
                        color: 'RED',
                        description: 'No results found.',
                        footer: {
                            text: '© Kamiko'
                        }
                    }
                ]
            })
        if (!results.length)
            return ctx.message.channel.send({
                embeds: [
                    {
                        color: 'RED',
                        description: 'No results found.',
                        footer: {
                            text: '© Kamiko'
                        }
                    }
                ]
            })
        const description = results.map((item: any, i: number) => `\`${this.formatIndex(i, results)}\`. ${this.searchResultFormatter(item)}`)
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle('Type a number to respond!')
            .setAuthor(`Results: ${ctx.args.join(' ')}`, this.client.user?.displayAvatarURL())
            .setDescription(description.join('\n'))
        await ctx.message.channel.send({ embeds: [embed] })
        this.awaitResponseMessage(ctx, results)
    }
    formatIndex(index: any, results: any) {
        index++
        if (results.length < 10) return index
        return index.toString().padStart(2, '0')
    }
    async awaitResponseMessage(context: IContext, results: any) {
        const { author, channel } = context.message
        const filter = (c: any) => c.author.equals(author) && this.verifyCollected(c.content, results.length)

        channel.awaitMessages({ filter, time: 10000, max: 1 }).then(collected => {
            if (collected.size > 0) {
                const result = results[Math.round(Number(collected.first()?.content)) - 1]
                this.handleResults(context, result)
            }
        })
    }
    verifyCollected(selected: any, length: any) {
        const number = Math.round(Number(selected))
        return number <= length && !isNaN(number) && number > 0
    }
    searchResultFormatter(i: any) {
        return `[${i.displayName} - ${i.publisher.displayName}](${EXTENSION_URL}${i.publisher.publisherName}.${i.extensionName})`
    }
    async findExtension(ctx: IContext) {
        const res = await this.client.custom_api.vscode.search(ctx.args.join(' '))
        return res.data.results[0].extensions
    }
    async handleResults(
        ctx: IContext,
        results: {
            displayName: string
            shortDescription: string
            publisher: {
                publisherName: string
            }
            versions: {
                assetUri: string
                lastUpdated: string
                version: string
            }[]
            extensionName: string
            statistics: { value: string }[]
            categories: string[]
            tags: string[]
        }
    ) {
        const { assetUri, lastUpdated, version } = results.versions[0]
        const embed = {
            color: 'DARK_BLUE' as ColorResolvable,
            title: results.displayName,
            url: `https://marketplace.visualstudio.com/items?itemName=${results.publisher.publisherName}.${results.extensionName}`,
            description: results.shortDescription,
            fields: [
                {
                    name: 'Publisher',
                    value: results.publisher.publisherName,
                    inline: true
                },
                {
                    name: 'Last updated',
                    value: `<t:${Math.floor(new Date(lastUpdated).getTime() / 1000)}:f> (version ${version})`,
                    inline: true
                },
                {
                    name: 'Downloads',
                    value: `${results.statistics[0].value.toLocaleString()} Downloads`,
                    inline: true
                },
                {
                    name: 'Categories',
                    value: results.categories.join(', '),
                    inline: true
                },
                {
                    name: 'Tags',
                    value: results.tags.join(', ').replace('__', ''),
                    inline: true
                },
                {
                    name: 'Rating',
                    value: `${'⭐'.repeat(Math.floor(results.statistics[1].value as unknown as number))} (${Math.round(results.statistics[1].value as unknown as number)})`,
                    inline: true
                }
            ],
            footer: {
                text: '© Kamiko'
            }
        }
        return ctx.message.channel.send({ embeds: [embed] })
    }
}
