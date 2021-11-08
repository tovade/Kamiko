import Command from '../../structures/Command'
import DiscordClient from '../../structures/DiscordClient'
import { IContext } from '../../utils/interfaces'
import { MessageEmbed } from 'discord.js'
import moment from 'moment'
import { pagination } from '../../utils/pagination'
export default class UserInfoCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'userinfo',
            group: 'Information',
            description: 'Get info on a member/user',
            examples: ['!userinfo @Tovade'],
            require: {
                member: true
            }
        })
    }
    async run(ctx: IContext) {
        const user = ctx.mentions.member?.user

        const created_at = moment(user?.createdTimestamp).format('LLLL')

        const bot = user?.bot ? 'Yes' : 'No'

        const user_embed = new MessageEmbed({
            title: `👱 user information 👱`,
            fields: [
                {
                    name: '**Name:**',
                    value: `\`\`\`${user?.username}\`\`\``,
                    inline: true
                },
                {
                    name: '**ID:**',
                    value: `\`\`\`${user?.id}\`\`\``,
                    inline: true
                },
                {
                    name: '**Joined Discord:**',
                    value: `\`\`\`${created_at}\`\`\``,
                    inline: false
                },
                {
                    name: '**Bot:**',
                    value: `\`\`\`${bot}\`\`\``,
                    inline: true
                },
                {
                    name: '**Discriminator:**',
                    value: `\`\`\`${user?.discriminator}\`\`\``,
                    inline: true
                },
                {
                    name: '**Full name:**',
                    value: `\`\`\`${user?.tag}\`\`\``,
                    inline: false
                }
            ],
            thumbnail: {
                url: user?.displayAvatarURL({ format: 'png', dynamic: true })
            },
            footer: {
                text: '© Kamiko'
            },
            color: this.client.config.color
        })
        const member = ctx.mentions.member

        const joined_at = moment(member?.joinedTimestamp).format('LLLL')

        const member_embed = new MessageEmbed({
            title: `👱 member information 👱`,
            fields: [
                {
                    name: '**Nickname:**',
                    value: `\`\`\`${member?.displayName}\`\`\``,
                    inline: true
                },
                {
                    name: '**ID:**',
                    value: `\`\`\`${user?.id}\`\`\``,
                    inline: true
                },
                {
                    name: '**Joined this server at:**',
                    value: `\`\`\`${joined_at}\`\`\``,
                    inline: false
                }
            ],
            thumbnail: {
                url: user?.displayAvatarURL({ format: 'png', dynamic: true })
            },
            footer: {
                text: '© Kamiko'
            },
            color: this.client.config.color
        })

        pagination(ctx.message, [user_embed, member_embed])
    }
}
