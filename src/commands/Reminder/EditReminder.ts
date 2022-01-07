import ms from 'ms';

import UserModel from '../../database/models/User';
import Command from '../../lib/structures/Command';
import { DiscordClient } from '../../lib/structures/DiscordClient';
import { IContext } from '../../utils/interfaces';

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'editreminder',
            group: 'Reminder',
            description: 'Edit an reminder',
            examples: ['!editreminder 1 1h ping me'],
            aliases: ['edit-reminder'],
            context: {
                args: 3
            }
        })
    }
    async run(ctx: IContext) {
        const [id, time, description] = ctx.args
        try {
            const user = await UserModel.findOne({ id: ctx.message.author.id })
            if (!user.reminder.hasReminder) return ctx.message.reply('You do not have any reminders active.')
            const reminder = user.reminder.reminders?.find((r: any) => (r as any).id === +id)
            const updated = user.reminder.reminders?.filter((r: { id: number }) => r.id !== +id)
            if (!reminder) return ctx.message.reply('That reminder was not found.')
            ;(reminder as any).time = time
            ;(reminder as any).ends_at = ms(time as string)
            ;(reminder as any).msg = description
            const newReminder = {
                time: time,
                ends_at: Date.now() + ms(time),
                msg: description,
                channel_id: (reminder as any).channel_id,
                id: (reminder as any).id,
                guild_id: ctx.message.guildId,
                user_id: user.id
            }
            await UserModel.findOneAndUpdate(
                { id: ctx.message.author.id },
                {
                    reminder: {
                        hasReminder: true,
                        reminders: [...(updated ?? []), newReminder]
                    }
                }
            )
            return ctx.message.channel.send('Updated your reminder :)')
        } catch (err) {
            return ctx.message.reply('Unexpected error has occured.')
        }
    }
}
