import { ColorResolvable, MessageEmbed, TextChannel } from 'discord.js';
const moment = require('moment');
import Command from '../../structures/Command';
import DiscordClient from '../../structures/DiscordClient';
import { IContext } from '../../utils/interfaces';

const types = {
    GUILD_TEXT: 'Text Channel',
    GUILD_VOICE: 'Voice Channel',
    GUILD_CATEGORY: 'Category',
    GUILD_NEWS: 'News channel',
    GUILD_STORE: 'Store channel'
};
export default class ChannelInfoCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'channelinfo',
            group: 'Information',
            description: 'Get info about a channel',
            examples: ['!channelinfo #faq'],
            require: {
                channel: true
            }
        });
    }
    async run(ctx: IContext) {
        const { channel } = ctx.mentions;

        const type = channel?.type;

        const createdAt = moment(channel?.createdTimestamp).format('LLLL');

        const chn = channel as TextChannel;

        const name = chn.name;

        const nsfw = chn.nsfw ? 'Yes' : 'No';

        const embed = new MessageEmbed({
            title: `<:channel:905436084735979520> ${name}`,
            color: this.client.config.color,
            fields: [
                {
                    name: '**ID:**',
                    value: channel?.id as string,
                    inline: true
                },
                {
                    name: '**Type:**',
                    value: type as string,
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
        });
        await ctx.message.channel.send({
            embeds: [embed]
        });
    }
}
