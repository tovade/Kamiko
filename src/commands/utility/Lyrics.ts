import { MessageEmbed } from 'discord.js'
import axios from 'axios'
import Command from '../../lib/structures/Command'
import { DiscordClient } from '../../lib/structures/DiscordClient'
import { IContext } from '../../utils/interfaces'

import { pagination } from '../../utils/pagination'

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'lyrics',
            group: 'Utility',
            description: 'lyrics command',
            examples: ['!lyrics thunder'],
            context: {
                args: 1
            }
        })
    }
    async run(ctx: IContext) {
        const query = ctx.args.join(' ')
        const { message } = ctx
        const data: any = await axios
            .get(`https://some-random-api.ml/lyrics?title=${encodeURI(query)}`)
            .then(res => res.data)
            .catch(() => null)
        if (!data || data.error!)
            return message.reply({
                embeds: [
                    {
                        color: 'RED',
                        title: '🔎 Unknown song',
                        description: `Couldn't find the lyrcis for \`${query}\``
                    }
                ]
            })
        if (data.lyrics.length < 2000) {
            return message.channel.send({
                embeds: [
                    {
                        color: this.client.config.color,
                        description: data.lyrics,
                        thumbnail: {
                            url: data.thumbnail.genius
                        },
                        author: {
                            url: data.links.genius,
                            name: `${data.title}\n${data.author}`
                        },
                        footer: {
                            text: '© Kamiko'
                        }
                    }
                ]
            })
        }
        const LyricsArray = data.lyrics.split('\n')
        const LyricsSub: string[] = []
        let n = 0
        for (const line of LyricsArray) {
            if (LyricsSub[n].length + line.length < 2000) {
                LyricsSub[n] = LyricsSub[n] + line + '\n'
            } else {
                n++
                LyricsSub.push(line)
            }
        }
        pagination(
            message,
            LyricsSub.map(
                (x, i) =>
                    new MessageEmbed({
                        color: this.client.config.color,
                        description: x,
                        thumbnail: {
                            url: data.thumbnail.genius
                        },
                        author: {
                            url: data.links.genius,
                            name: `${data.title}\n${data.author}`
                        },
                        footer: {
                            text: `${[`Page: ${i + 1} of ${LyricsSub.length}`].join('\u2000•\u2000')} © Kamiko`
                        }
                    })
            )
        )
    }
}
