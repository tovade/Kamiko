import Command from '../../lib/structures/Command'
import { DiscordClient } from '../../lib/structures/DiscordClient'
import { IContext } from '../../utils/interfaces'

export default class PrefixCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'prefix',
            group: 'Administration',
            description: 'Change the prefix!',
            examples: ['!prefix ?'],
            context: {
                permissions: ['MANAGE_MESSAGES'],
                args: 1,
                guildOnly: true
            }
        })
    }
    async run(ctx: IContext) {
        const { message } = ctx
        const args = ctx.args.getAll()
        if (args[0].length > 6)
            return message.reply({
                embeds: [
                    {
                        color: 'RED',
                        title: '🚨 Error',
                        description: `The prefix can not be longer then 6 characters`
                    }
                ]
            })

        await this.client.databases.guilds.set(message.guildId as string, 'prefix', args[0])

        return message.channel.send({
            embeds: [
                {
                    color: this.client.config.color,
                    title: '✅ Prefix has been set!',
                    description: `The prefix is now \`${args[0]}\``
                }
            ]
        })
    }
}
