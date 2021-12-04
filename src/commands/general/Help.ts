import { CommandInteraction, Message, MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js'
import { IContext } from '../../utils/interfaces'
import Command from '../../lib/structures/Command'
import { DiscordClient } from '../../lib/structures/DiscordClient'
import { formatSeconds } from '../../utils/functions'

interface IGroup {
    name: string
    commands: string[]
}

export default class HelpCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'help',
            group: 'General',
            description: 'Shows information about commands and groups.',
            cooldown: 10,
            type: 'BOTH',
            slashOptions: [
                {
                    name: 'command',
                    description: 'command',
                    type: 'STRING'
                }
            ]
        })
    }

    getAvailableGroups(message: Message | CommandInteraction): IGroup[] {
        const registry = this.client.registry
        const groupKeys = registry.getAllGroupNames()
        const groups: IGroup[] = []

        groupKeys.forEach(group => {
            const commandsInGroup = registry.findCommandsInGroup(group) as string[]
            const commands: string[] = []

            commandsInGroup.forEach(commandName => {
                const command = registry.findCommand(commandName) as Command
                if (!command.isUsable(message)) return
                commands.push(commandName)
            })

            if (commands.length) groups.push({ name: group, commands })
        })

        return groups
    }

    async sendHelpMessage(message: Message | CommandInteraction, select: MessageSelectMenu) {
        const embed = new MessageEmbed({
            color: this.client.config.color,
            title: 'Help',
            description: 'Hello! This is the help command, use the select menu below to get my commands!\nThanks for using me! ❤',
            footer: {
                text: `Type "${this.client.config.prefix}help [command-name]" for more information.`
            }
        })
        const ActionRow = new MessageActionRow().addComponents([select])

        await message.reply({ embeds: [embed], components: [ActionRow], allowedMentions: { users: [] } })
    }

    async run(ctx: IContext) {
        const { message, args } = ctx
        const menu = this.createSelectMenu(message)
        const groups = this.getAvailableGroups(message)
        if (!args[0]) return await this.sendHelpMessage(message, menu)

        const command = this.client.registry.findCommand(args[0].toLocaleLowerCase())
        if (!command) return await this.sendHelpMessage(message, menu)
        var isAvailable = false

        groups.forEach(group => {
            if (group.commands.includes(command.info.name)) isAvailable = true
        })

        if (!isAvailable) return await this.sendHelpMessage(message, menu)

        const embed = new MessageEmbed({
            color: this.client.config.color,
            title: 'Help',
            fields: [
                {
                    name: 'Name',
                    value: command.info.name,
                    inline: false
                },
                {
                    name: 'Group',
                    value: command.info.group,
                    inline: false
                },
                {
                    name: 'Cooldown',
                    value: command.info.cooldown ? formatSeconds(command.info.cooldown) : 'No cooldown',
                    inline: false
                },
                {
                    name: 'Usable At',
                    value: command.info.onlyNsfw ? 'NSFW channels' : 'All text channels',
                    inline: false
                },
                {
                    name: 'Aliases',
                    value: command.info.aliases ? command.info.aliases.map(x => `\`${x}\``).join(' ') : 'No aliases',
                    inline: false
                },
                {
                    name: 'Example Usages',
                    value: command.info.examples ? command.info.examples.map(x => `\`${x}\``).join('\n') : 'No examples',
                    inline: false
                },
                {
                    name: 'Description',
                    value: command.info.description ? command.info.description : 'No description',
                    inline: false
                }
            ],
            footer: {
                text: '© Kamiko'
            }
        })

        if (command.info.context) {
            if (command.info.context.developer) embed.setFooter('This is a developer command.')
            if (command.info.context.permissions) embed.addField('Permission Requirements', command.info.context.permissions.map(x => `\`${x}\``).join('\n'))
        }

        await message.channel.send({ embeds: [embed] })
    }
    private createSelectMenu(message: Message | CommandInteraction) {
        const menu = new MessageSelectMenu().setCustomId('HELP_CATEGORIES').setPlaceholder('Select a category').setMinValues(0).setMaxValues(1)
        const groups = this.getAvailableGroups(message)
        groups.forEach(group => {
            menu.addOptions([
                {
                    label: this.toCapitalize(group.name),
                    description: `${this.toCapitalize(group.name)} commands`,
                    value: group.name
                }
            ])
        })

        return menu
    }
    private toCapitalize(str: string) {
        const split = str.split('')
        return `${split[0].toUpperCase()}${split.slice(1, str.length).join('')}`
    }
    async runSlash(interaction: CommandInteraction) {
        const menu = this.createSelectMenu(interaction)
        const groups = this.getAvailableGroups(interaction)
        const optionCmd = interaction.options.getString('command')
        if (!optionCmd) return await this.sendHelpMessage(interaction, menu)
        const command = this.client.registry.findCommand(optionCmd)
        if (!command) return await this.sendHelpMessage(interaction, menu)
        var isAvailable = false

        groups.forEach(group => {
            if (group.commands.includes(command.info.name)) isAvailable = true
        })

        if (!isAvailable) return await this.sendHelpMessage(interaction, menu)

        const embed = new MessageEmbed({
            color: this.client.config.color,
            title: 'Help',
            fields: [
                {
                    name: 'Name',
                    value: command.info.name,
                    inline: false
                },
                {
                    name: 'Group',
                    value: command.info.group,
                    inline: false
                },
                {
                    name: 'Cooldown',
                    value: command.info.cooldown ? formatSeconds(command.info.cooldown) : 'No cooldown',
                    inline: false
                },
                {
                    name: 'Usable At',
                    value: command.info.onlyNsfw ? 'NSFW channels' : 'All text channels',
                    inline: false
                },
                {
                    name: 'Aliases',
                    value: command.info.aliases ? command.info.aliases.map(x => `\`${x}\``).join(' ') : 'No aliases',
                    inline: false
                },
                {
                    name: 'Example Usages',
                    value: command.info.examples ? command.info.examples.map(x => `\`${x}\``).join('\n') : 'No examples',
                    inline: false
                },
                {
                    name: 'Description',
                    value: command.info.description ? command.info.description : 'No description',
                    inline: false
                }
            ],
            footer: {
                text: '© Kamiko'
            }
        })

        if (command.info.context) {
            if (command.info.context.developer) embed.setFooter('This is a developer command.')
            if (command.info.context.permissions) embed.addField('Permission Requirements', command.info.context.permissions.map(x => `\`${x}\``).join('\n'))
        }
        interaction.reply({ embeds: [embed] })
    }
}
