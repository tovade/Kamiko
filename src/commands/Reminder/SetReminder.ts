import Command from '../../lib/structures/Command'
import { DiscordClient } from '../../lib/structures/DiscordClient'
import { IContext } from '../../utils/interfaces'
import ms from 'ms'
export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'setreminder',
            group: 'Reminder',
            description: 'Get all your active reminders',
            examples: ['!setreminder 4h open visual studio code'],
            aliases: ['set-reminder'],
            context: {
                args: 2
            }
        })
    }
    async run(ctx: IContext) {
        try {
            const { message, args } = ctx
            const [time, ...rest] = args
            const msg = rest.join(' ')
            const isValid = ms(time)
            if (!isValid) return message.reply('Are you sure that is a valid time?')
            const user = await this.client.databases.users.get(message.author.id)
            const reminders = typeof user.reminder.reminders === 'object' ? user.reminder.reminders : []
            await this.client.databases.users.set(message.author.id, 'reminder', {
                hasReminder: true,
                reminders: [
                    ...reminders,
                    {
                        ends_at: Date.now() + ms(time),
                        msg,
                        channel_id: message.channel.id,
                        time,
                        id: reminders.length + 1,
                        guild_id: message.guildId,
                        user_id: user.id
                    }
                ]
            })
            return message.channel.send('Succesfully placed a reminder!')
        } catch (e) {
            console.log(e)
            ctx.message.reply('An unexpected error has occured!')
        }
    }
}
