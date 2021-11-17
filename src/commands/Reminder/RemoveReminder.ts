import Command from '../../lib/structures/Command'
import { DiscordClient } from '../../lib/structures/DiscordClient'
import { IContext } from '../../utils/interfaces'
export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'removereminder',
            group: 'Reminder',
            description: 'Get all your active reminders',
            examples: ['!remove-reminder all', '!remove-reminder 1'],
            context: {
                args: 1
            },
            aliases: ['remove-reminder']
        })
    }
    async run(ctx: IContext) {
        const [id] = ctx.args
        try {
            const user = await this.client.databases.users.get(ctx.message.author.id)
            if (!user) return
            if (!user?.reminder.hasReminder === false) return ctx.message.reply("You don't have any reminders")
            if (id === 'all') {
                await this.client.databases.users.set(ctx.message.author.id, 'reminder', {
                    hasReminder: false,
                    reminders: []
                })

                return ctx.message.reply({ content: 'All your reminders have been deleted.' })
            }

            switch (id) {
                case 'first': {
                    ;(id as string) = ((user.reminder.reminders as any)[0] as any).id
                    break
                }
                case 'last': {
                    ;(id as string) = ((user.reminder.reminders as any)[0] as any)[(user.reminder.reminders?.length as any) - 1].id
                    break
                }
                default: {
                    break
                }
            }
            await this.client.databases.users.set(ctx.message.author.id, 'reminder', {
                hasReminder: (user.reminder.reminders?.length as any) - 1 > 0,
                reminders: user.reminder.reminders?.filter((r: any) => (r as any).id !== +id)
            })
        } catch (err) {
            ctx.message.channel.send('An unexpected error has occured!')
        }
    }
}
