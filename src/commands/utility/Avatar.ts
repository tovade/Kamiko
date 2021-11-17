import Command from '../../lib/structures/Command'
import { DiscordClient } from '../../lib/structures/DiscordClient'
import { IContext } from '../../utils/interfaces'
import { MessageEmbed, MessageButton, MessageActionRow } from 'discord.js'
export default class AvatarCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'avatar',
            group: 'Utility',
            description: 'Get the avatar of an user',
            context: {
                member: true
            }
        })
    }
    //As an example on how to cancel cooldowns
    async run(ctx: IContext) {
        const user = ctx.mentions.member?.user
        let embed = new MessageEmbed()
            .setColor(this.client.config.color)
            .setTitle(`<:info:905435119253344316> • ${user?.username}'s Avatar`)
            .setDescription(`\`Click the button below to download!\``)
            .setFooter('Request by ' + ctx.message.author.tag, ctx.message.author.displayAvatarURL())
            .setImage(user?.avatarURL({ size: 2048, dynamic: true, format: 'png' }) as string)

        const row = new MessageActionRow().addComponents([
            new MessageButton()
                .setURL(user?.displayAvatarURL({ size: 2048, dynamic: true, format: 'png' }) as string)
                .setLabel('PNG')
                .setStyle('LINK'),
            new MessageButton()
                .setURL(user?.displayAvatarURL({ size: 2048, dynamic: true, format: 'jpg' }) as string)
                .setLabel('JPG')
                .setStyle('LINK'),
            new MessageButton()
                .setURL(user?.displayAvatarURL({ size: 2048, dynamic: true, format: 'webp' }) as string)
                .setLabel('WEBP')
                .setStyle('LINK'),
            new MessageButton()
                .setURL(user?.displayAvatarURL({ size: 2048, dynamic: true, format: 'gif' }) as string)
                .setLabel('GIF')
                .setStyle('LINK')
        ])

        ctx.message.channel.send({ embeds: [embed], components: [row] })
    }
}
