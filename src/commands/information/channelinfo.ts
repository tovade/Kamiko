import { Channel, ColorResolvable, MessageEmbed, StageChannel, TextChannel, VoiceChannel } from 'discord.js'
const moment = require('moment')
import Command from '../../lib/structures/Command'
import { DiscordClient } from '../../lib/structures/DiscordClient'
import { IContext } from '../../utils/interfaces'

const types = {
    GUILD_TEXT: '<:channel:905436084735979520> Text Channel',
    DM: 'Direct Message',
    GUILD_VOICE: '<:voice_channel:906131217773109248> Voice Channel',
    GUILD_CATEGORY: 'Category',
    GUILD_NEWS: 'News channel',
    GUILD_STORE: 'Store channel',
    GROUP_DM: 'Group Direct Message',
    GUILD_NEWS_THREAD: 'News Thread',
    GUILD_PUBLIC_THREAD: 'Public Thread',
    GUILD_PRIVATE_THREAD: 'Private Thread',
    GUILD_STAGE_VOICE: '<:stage_channel:906131217378840617> Stage Channel',
    UNKNOWN: 'Unknown'
}
export default class ChannelInfoCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'channelinfo',
            group: 'Information',
            description: 'Get info about a channel',
            examples: ['!channelinfo #faq'],
            context: {
                channel: true,
                guildOnly: true
            }
        })
    }
    async run(ctx: IContext) {
        const channel = ctx.mentions.channel as Channel

        const name = (channel as TextChannel)?.name
        const type = channel?.type

        const createdAt = moment(channel?.createdTimestamp).format('LLLL')

        let embed
        if (channel?.type === 'GUILD_TEXT') {
            const chn = channel as TextChannel

            const nsfw = chn.nsfw ? 'Yes' : 'No'
            embed = new MessageEmbed({
                title: `${name}`,
                color: this.client.config.color,
                fields: [
                    {
                        name: '**ID:**',
                        value: channel?.id as string,
                        inline: true
                    },
                    {
                        name: '**Type:**',
                        value: types[type] as string,
                        inline: true
                    },
                    {
                        name: '**Created at:**',
                        value: createdAt as string,
                        inline: true
                    },
                    { name: '**Topic:**', value: (chn.topic as string) || 'No topic', inline: true },
                    { name: '**Nsfw:**', value: nsfw as string, inline: true },
                    { name: '**Category:**', value: (chn.parent?.name as string) || 'No category', inline: true },
                    { name: '**Slowmode:**', value: (chn.rateLimitPerUser as unknown as string) || 'No slowmode', inline: true }
                ],
                footer: {
                    text: '© Kamiko'
                }
            })
        } else if (channel.type === 'GUILD_VOICE') {
            const chn = channel as VoiceChannel
            embed = new MessageEmbed({
                title: `${name}`,
                color: this.client.config.color,
                fields: [
                    {
                        name: '**ID:**',
                        value: channel?.id as string,
                        inline: true
                    },
                    {
                        name: '**Type:**',
                        value: types[type] as string,
                        inline: true
                    },
                    {
                        name: '**Created at:**',
                        value: createdAt as string,
                        inline: true
                    },
                    { name: '**Category:**', value: (chn.parent?.name as string) || 'No category', inline: true },
                    { name: '**User Limit:**', value: chn.userLimit.toString() || 'No limit', inline: true },
                    { name: '**Bit Rate:**', value: `${chn.bitrate.toString()}kbps`, inline: true }
                ],
                footer: {
                    text: '© Kamiko'
                }
            })
        } else if (channel.type === 'GUILD_STAGE_VOICE') {
            const chn = channel as StageChannel
            embed = new MessageEmbed({
                title: `${name}`,
                color: this.client.config.color,
                fields: [
                    {
                        name: '**ID:**',
                        value: channel?.id as string,
                        inline: true
                    },
                    {
                        name: '**Type:**',
                        value: types[type] as string,
                        inline: true
                    },
                    {
                        name: '**Created at:**',
                        value: createdAt as string,
                        inline: true
                    },
                    { name: '**Category:**', value: (chn.parent?.name as string) || 'No category', inline: true },
                    { name: '**Bit Rate:**', value: `${chn.bitrate.toString()}kbps`, inline: true },
                    { name: '**Channel Members:**', value: `${chn.members.size.toString()}kbps`, inline: true }
                ],
                footer: {
                    text: '© Kamiko'
                }
            })
        } else {
            const chn = channel as TextChannel
            embed = new MessageEmbed({
                title: `${name}`,
                color: this.client.config.color,
                fields: [
                    {
                        name: '**ID:**',
                        value: channel?.id as string,
                        inline: true
                    },
                    {
                        name: '**Type:**',
                        value: types[type] as string,
                        inline: true
                    },
                    {
                        name: '**Created at:**',
                        value: createdAt as string,
                        inline: true
                    },
                    { name: '**Category:**', value: (chn.parent?.name as string) || 'No category', inline: true }
                ],
                footer: {
                    text: '© Kamiko'
                }
            })
        }
        await ctx.message.channel.send({
            embeds: [embed as MessageEmbed]
        })
    }
}
