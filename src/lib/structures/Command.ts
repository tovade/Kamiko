import { CommandInteraction, GuildMember, Interaction, Message, TextBasedChannel, TextChannel } from 'discord.js'

import Logger from '../../classes/Logger'
import { isUserDeveloper } from '../../utils/functions'
import { ICommandInfo, IContext } from '../../utils/interfaces'
import { DiscordClient } from './DiscordClient'

export default abstract class Command {
    /**
     * Discord client.
     */
    readonly client: DiscordClient

    /**
     * Information of the command.
     */
    readonly info: ICommandInfo

    constructor(client: DiscordClient, info: ICommandInfo) {
        this.client = client
        this.info = info
    }

    /**
     * Executes when command throws an error.
     * @param message Message object
     * @param error Error message
     */
    async onError(message: Message, error: any) {
        Logger.log('ERROR', `An error occurred in "${this.info.name}" command.\n${error.stack}\n`, true)
        await (message.channel as TextChannel).send({
            embeds: [
                {
                    color: 'RED',
                    title: '💥 Oops...',
                    description: `${message.author}, an error occurred while running this command. Please try again later.`
                }
            ]
        })
    }

    /**
     * Returns usability of the command
     * @param message Message object
     * @param checkNsfw Checking nsfw channel
     */
    isUsable(message: Message | CommandInteraction, checkNsfw: boolean = false): boolean {
        if (this.info.enabled === false) return false
        if (checkNsfw && this.info.onlyNsfw === true && !(message.channel as unknown as TextChannel).nsfw && !isUserDeveloper(this.client, message.member?.user.id as string))
            return false
        if (this.info.context) {
            if (this.info.context.developer && !isUserDeveloper(this.client, message.member?.user.id as string)) return false
            if (this.info.context.permissions && !isUserDeveloper(this.client, message.member?.user.id as string)) {
                const perms: string[] = []
                this.info.context.permissions.forEach(permission => {
                    if ((message.member as GuildMember).permissions.has(permission)) return
                    else return perms.push(permission)
                })
                if (perms.length) return false
            }
        }

        return true
    }

    /**
     * Runs the command.
     * @param context Context
     * @param cancelCooldown Cancels cooldown when function called
     */
    abstract run(context: IContext, cancelCooldown?: () => void): Promise<any>

    /**
     * Runs the slash command.
     * @param interaction Interaction
     */
    runSlash?(interaction: Interaction): Promise<any>
}
