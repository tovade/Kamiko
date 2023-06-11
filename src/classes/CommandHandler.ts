import { Guild, GuildMember, Message, MessageActionRow, MessageButton, MessageEmbed, Permissions, TextChannel } from 'discord.js'

import { Args } from '../lib/structures/Args'
import { DiscordClient } from '../lib/structures/DiscordClient'
import { findChannel, findMember, findRole, formatSeconds, isUserDeveloper } from '../utils/functions'
import { IContext } from '../utils/interfaces'
import leven from '../utils/leven'

export default class CommandHandler {
    /**
     * Handles the commands.
     * @param message Message object
     */
    static async handleCommand(client: DiscordClient, message: Message) {
        const self = (message.guild as Guild).me as GuildMember
        if (!self.permissions.has(Permissions.FLAGS.SEND_MESSAGES) && !(message.channel as TextChannel).permissionsFor(self)?.has(Permissions.FLAGS.SEND_MESSAGES)) return
        let prefix
        if (message.guild?.name) {
            prefix = (await client.databases.guilds.get(message.guildId as string)).prefix as unknown as string
        } else return
        const prefixMention = new RegExp(`^<@!?${client.user?.id}>( |)$`)
        if (message.content.match(prefixMention)) {
            let ping = new MessageEmbed()
                .setAuthor(client.user?.username as string, client.user?.displayAvatarURL({ dynamic: true }))
                .setTitle(`Hello! I am ${client.user?.username} My prefix is ${prefix}`)
                .addField('Usage:', `\`${prefix}help\``)
                .setDescription('Make sure to check out the links down below!')
                .setFooter(message.guild?.name as string)
                .setTimestamp()

            const row = new MessageActionRow().addComponents(
                new MessageButton().setLabel(`Support server!`).setURL('https://discord.gg/e9bYSySh5k').setStyle(5).setEmoji('❓'),

                new MessageButton()
                    .setLabel('Invite me!')
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=904321999302717500&permissions=0&scope=bot')
                    .setStyle(5)
                    .setEmoji('✉️')
            )

            await message.channel.send({ embeds: [ping], components: [row] })
        }

        if (message.content.toLocaleLowerCase().indexOf(prefix) !== 0) return
        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const command = (args.shift() as string).toLowerCase()

        const cmd = client.registry.findCommand(command)
        if (!cmd) {
            if (client.config.unknownErrorMessage) {
                const best = [...client.registry.commands.map(cmde => cmde.info.name), ...client.registry.aliases.keys()].filter(
                    c => leven((command as any).toLowerCase(), (c as any).toLowerCase()) < (c as any).length * 0.4
                )
                const dym =
                    best.length == 0
                        ? ''
                        : best.length == 1
                        ? `- ${command}\n+ ${best[0]}`
                        : `${best
                              .slice(0, 3)
                              .map(value => `- ${command}\n+ ${value}`)
                              .join('\n')}`

                if (dym)
                    await message.channel.send({
                        embeds: [
                            {
                                color: '#D1D1D1',
                                title: '🔎 Unknown Command',
                                description: `${message.author}, did you mean: \`\`\`diff\n${dym}\`\`\``
                            }
                        ]
                    })
            }
            return
        }
        if (cmd.info.type === 'SLASH')
            return message.reply({
                embeds: [
                    {
                        color: 'ORANGE',
                        title: '🚨 Error',
                        description: `${message.author}, This command is only usable with slash commands. Please use the command via its slash command.`
                    }
                ]
            })
        if (cmd.info.context?.guildOnly === true && message.channel.type !== 'GUILD_TEXT') {
            return await message.channel.send({
                embeds: [
                    {
                        color: 'RED',
                        title: '🚨 Error',
                        description: `${message.author}, This command is only available in a server.`
                    }
                ]
            })
        }
        if (cmd.info.enabled === false) return
        if (cmd.info.onlyNsfw === true && !(message.channel as TextChannel).nsfw && !isUserDeveloper(client, message.author.id))
            return await message.channel.send({
                embeds: [
                    {
                        color: '#EEB4D5',
                        title: '🔞 Be Careful',
                        description: `${message.author}, you can't use this command on non-nsfw channels.`
                    }
                ]
            })
        let mentions
        if (cmd.info.context) {
            if (cmd.info.context.developer && !isUserDeveloper(client, message.author.id)) return
            if (cmd.info.context.permissions && !isUserDeveloper(client, message.author.id)) {
                const perms: string[] = []
                cmd.info.context.permissions.forEach(permission => {
                    if ((message.member as GuildMember).permissions.has(permission)) return
                    else return perms.push(`\`${permission}\``)
                })
                if (perms.length)
                    return await message.channel.send({
                        embeds: [
                            {
                                color: '#FCE100',
                                title: '⚠️ Missing Permissions',
                                description: `${message.author}, you must have these permissions to run this command.\n\n${perms.join('\n')}`
                            }
                        ]
                    })
            }
            if (cmd.info.context.clientPermissions) {
                const perms: string[] = []
                cmd.info.context.clientPermissions.forEach(permission => {
                    if ((message.guild?.me as GuildMember).permissions.has(permission)) return
                    else return perms.push(`\`${permission}\``)
                })
                if (perms.length)
                    return await message.channel.send({
                        embeds: [
                            {
                                color: '#FCE100',
                                title: '⚠️ Missing Permissions',
                                description: `${message.author}, I must have these permissions to run this command.\n\n${perms.join('\n')}`
                            }
                        ]
                    })
            }
            if (cmd.info.context.member) {
                const requir = await findMember(message, args, true)
                if (!requir)
                    return await message.channel.send({
                        embeds: [
                            {
                                color: '#FCE100',
                                title: '⚠ Missing Mentions.',
                                description: `${message.author}, You must mention a member to run this command!`
                            }
                        ]
                    })
                args.shift()
                mentions = {
                    member: requir
                }
            } else if (cmd.info.context.channel) {
                const requir = await findChannel(message, args, true)
                if (!requir)
                    return await message.channel.send({
                        embeds: [
                            {
                                color: '#FCE100',
                                title: '⚠ Missing Mentions.',
                                description: `${message.author}, You must mention a channel to run this command!`
                            }
                        ]
                    })
                args.shift()
                mentions = {
                    channel: requir
                }
            } else if (cmd.info.context.role) {
                const requir = await findRole(message, args, false)
                if (!requir)
                    return await message.channel.send({
                        embeds: [
                            {
                                color: '#FCE100',
                                title: '⚠ Missing Mentions.',
                                description: `${message.author}, You must mention a role to run this command!`
                            }
                        ]
                    })
                args.shift()
                mentions = {
                    role: requir
                }
            }
        }
        if (cmd.info.context?.args) {
            if (args.length < cmd.info.context?.args) {
                return await message.channel.send({
                    embeds: [
                        {
                            color: '#FCE100',
                            title: '⚠ Missing Arguments.',
                            description: `${message.author}, You must give ${cmd.info.context.args} arguments to run this command! If you don't know which arguments use \`${prefix}help ${cmd.info.name}\` to see the full usage.`
                        }
                    ]
                })
            }
        }

        var addCooldown = false

        const now = Date.now()
        const timestamps = client.registry.getCooldownTimestamps(cmd.info.name)
        const cooldownAmount = cmd.info.cooldown ? cmd.info.cooldown * 1000 : 0
        if (cmd.info.cooldown) {
            if (timestamps.has(message.author.id)) {
                const currentTime = timestamps.get(message.author.id)
                if (!currentTime) return

                const expirationTime = currentTime + cooldownAmount
                if (now < expirationTime) {
                    await message.delete()
                    const timeLeft = (expirationTime - now) / 1000
                    return await message.channel
                        .send({
                            embeds: [
                                {
                                    color: 'ORANGE',
                                    title: '⏰ Calm Down',
                                    description: `${message.author}, you must wait \`${formatSeconds(Math.floor(timeLeft))}\` to run this command.`
                                }
                            ]
                        })
                        .then(msg => setTimeout(async () => await msg.delete().catch(() => {}), 3000))
                }
            }

            addCooldown = true
        }

        try {
            var applyCooldown = true

            const context = {
                message,
                args: new Args(client, args),
                mentions
            }

            await cmd.run(context as IContext, () => {
                applyCooldown = false
            })

            if (addCooldown && applyCooldown && !isUserDeveloper(client, message.author.id)) {
                timestamps.set(message.author.id, now)
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
            }
        } catch (error) {
            await cmd.onError(message, error)
        }
    }
}
