import * as DJS from 'discord.js';

import { DiscordClient } from '../lib/structures/DiscordClient';
import { Helper } from '../lib/structures/Helper';

export interface Reminder {
    _id: string
    /**
     * uuid but 8 characters long
     */
    id: string
    channel_id: DJS.Snowflake
    msg: string
    time: string
    ends_at: number
    user_id: DJS.Snowflake
}
export default class ReminderHelper extends Helper {
    private TEN_SECOND_INTERVAL = 10_000

    constructor(bot: DiscordClient) {
        super(bot, 'reminderHelper')
    }

    async execute() {
        setInterval(async () => {
            const remindersArray = await this.client.databases.users.repository.find({
                select: ['reminder']
            })
            const reminders = remindersArray.filter(u => u.reminder.hasReminder === true)
            if (!reminders) return

            reminders.forEach((user: any) => {
                user.reminder.reminders
                    .filter((r: any) => r.ends_at <= Date.now())
                    .forEach(async (reminder: Reminder) => {
                        const { channel_id, msg, time, id: reminderId, user_id } = reminder

                        const channel = this.client.channels.cache.get(channel_id)

                        if (!channel) {
                            await this.client.databases.users.set(user_id, 'reminder', {
                                hasReminder: !(user.reminder.reminders?.length - 1 === 0),
                                reminders: user.reminder.reminders.filter((rem: Reminder) => rem.id !== reminderId)
                            })
                            return
                        }

                        await this.client.databases.users.set(user_id, 'reminder', {
                            hasReminder: !(user.reminder.reminders?.length - 1 === 0),
                            reminders: user.reminder.reminders.filter((rem: Reminder) => rem.id !== reminderId)
                        })

                        const embed = new DJS.MessageEmbed()
                            .setAuthor(this.client.user?.username as string, this.client.user?.displayAvatarURL({ format: 'png' }))
                            .setTitle('Reminder finished')
                            .setDescription(`Your timer of **${time}** has ended`)
                            .addField('Reminder message', msg)
                        if (!(channel as DJS.TextChannel).permissionsFor((channel as DJS.TextChannel).guild.me!)?.has(DJS.Permissions.FLAGS.SEND_MESSAGES)) {
                            return
                        }
                        ;(channel as DJS.TextChannel).send({ content: `<@${user_id}>`, embeds: [embed] })
                    })
            })
        }, this.TEN_SECOND_INTERVAL)
    }
}
