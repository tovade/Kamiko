import Command from '../../lib/structures/Command'
import { DiscordClient } from '../../lib/structures/DiscordClient'
import { IContext } from '../../utils/interfaces'
import { findMember } from '../../utils/functions'
import moment from 'moment'
import { GuildMember, MessageEmbed } from 'discord.js'
export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'reminders',
            group: 'Reminder',
            description: 'Get all your active reminders',
            examples: ['!reminders @Tovade']
        })
    }
    async run(ctx: IContext) {
        try {
            const { message, args } = ctx
            const member = await findMember(message, args, true)
            const user = await this.client.databases.users.get(member?.id as string)
            if (user.reminder.hasReminder === false) {
                return message.reply('This user has no reminders.')
            }
            const mappedReminders = user.reminder.reminders?.map((reminder: any) => {
                const endsAt = moment.duration((reminder as any).ends_at - Date.now()).format('D [days], H [Hrs], m [mins], s [secs]')
                return `**Message:** ${(reminder as any).msg}
                **Time:** ${(reminder as any).time}
                **ID:** ${(reminder as any).id}
                **Ends in:** ${endsAt}`
            })
            const embed = new MessageEmbed().setTitle(`Reminders for ${(member as unknown as GuildMember).user.username}`).setDescription(mappedReminders?.join('\n\n') as string)
            message.channel.send({ embeds: [embed] })
        } catch (e) {
            console.log(e)
            ctx.message.reply('An unexpected error has occured!')
        }
    }
}
