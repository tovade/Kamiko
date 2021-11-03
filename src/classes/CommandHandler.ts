import { Channel, Guild, GuildMember, Message, NewsChannel, PartialDMChannel, Role, TextChannel, ThreadChannel } from 'discord.js';
import leven from '../utils/leven';
import DiscordClient from '../structures/DiscordClient';
import { formatSeconds, isUserDeveloper } from '../utils/functions';
import { IContext } from '../utils/interfaces';
import Command from '../structures/Command';

export default class CommandHandler {
    /**
     * Handles the commands.
     * @param message Message object
     */
    static async handleCommand(client: DiscordClient, message: Message) {
        const self = (message.guild as Guild).me as GuildMember;
        if (!self.permissions.has('SEND_MESSAGES') || !(message.channel as TextChannel).permissionsFor(self)?.has('SEND_MESSAGES')) return;
        if (!self.permissions.has('ADMINISTRATOR'))
            return await message.channel.send({
                embeds: [
                    {
                        color: 'RED',
                        title: '🚨 Missing Permission',
                        description: `${message.author}, bot requires \`ADMINISTRATOR\` permission to be run.`
                    }
                ]
            });

        const prefix = client.config.prefix;
        if (message.content.toLocaleLowerCase().indexOf(prefix) !== 0) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = (args.shift() as string).toLowerCase();

        const cmd = client.registry.findCommand(command);
        if (!cmd) {
            if (client.config.unknownErrorMessage) {
                const best = [...client.registry.commands.map(cmde => cmde.info.name), ...client.registry.aliases.keys()].filter(
                    c => leven((command as any).toLowerCase(), (c as any).toLowerCase()) < (c as any).length * 0.4
                );
                const dym =
                    best.length == 0
                        ? ''
                        : best.length == 1
                        ? `- ${command}\n+ ${best[0]}`
                        : `${best
                              .slice(0, 3)
                              .map(value => `- ${command}\n+ ${value}`)
                              .join('\n')}`;

                if (dym)
                    await message.channel.send({
                        embeds: [
                            {
                                color: '#D1D1D1',
                                title: '🔎 Unknown Command',
                                description: `${message.author}, did you mean: \`\`\`diff\n${dym}\`\`\``
                            }
                        ]
                    });
            }
            return;
        }

        if (cmd.info.enabled === false) return;
        if (cmd.info.onlyNsfw === true && !(message.channel as TextChannel).nsfw && !isUserDeveloper(client, message.author.id))
            return await message.channel.send({
                embeds: [
                    {
                        color: '#EEB4D5',
                        title: '🔞 Be Careful',
                        description: `${message.author}, you can't use this command on non-nsfw channels.`
                    }
                ]
            });
        let mentions;
        if (cmd.info.require) {
            if (cmd.info.require.developer && !isUserDeveloper(client, message.author.id)) return;
            if (cmd.info.require.permissions && !isUserDeveloper(client, message.author.id)) {
                const perms: string[] = [];
                cmd.info.require.permissions.forEach(permission => {
                    if ((message.member as GuildMember).permissions.has(permission)) return;
                    else return perms.push(`\`${permission}\``);
                });
                if (perms.length)
                    return await message.channel.send({
                        embeds: [
                            {
                                color: '#FCE100',
                                title: '⚠️ Missing Permissions',
                                description: `${message.author}, you must have these permissions to run this command.\n\n${perms.join('\n')}`
                            }
                        ]
                    });
            }
            if (cmd.info.require.member) {
                const requir = await this.findMember(message, args, false);
                if (!requir)
                    return await message.channel.send({
                        embeds: [
                            {
                                color: '#FCE100',
                                title: '⚠ Missing Mentions.',
                                description: `${message.author}, You must mention a member to run this command!`
                            }
                        ]
                    });
                args.shift();
                mentions = {
                    member: requir
                };
            } else if (cmd.info.require.channel) {
                const requir = await this.findChannel(message, args, false);
                if (!requir)
                    return await message.channel.send({
                        embeds: [
                            {
                                color: '#FCE100',
                                title: '⚠ Missing Mentions.',
                                description: `${message.author}, You must mention a channel to run this command!`
                            }
                        ]
                    });
                args.shift();
                mentions = {
                    channel: requir
                };
            } else if (cmd.info.require.role) {
                const requir = await this.findRole(message, args, false);
                if (!requir)
                    return await message.channel.send({
                        embeds: [
                            {
                                color: '#FCE100',
                                title: '⚠ Missing Mentions.',
                                description: `${message.author}, You must mention a role to run this command!`
                            }
                        ]
                    });
                args.shift();
                mentions = {
                    role: requir
                };
            }
        }
        if (cmd.info.require?.args) {
            if (args.length < cmd.info.require?.args) {
                return await message.channel.send({
                    embeds: [
                        {
                            color: '#FCE100',
                            title: '⚠ Missing Arguments.',
                            description: `${message.author}, You must give ${cmd.info.require.args} arguments to run this command! If you don't know which arguments use !help [command] to see the full usage.`
                        }
                    ]
                });
            }
        }

        var addCooldown = false;

        const now = Date.now();
        const timestamps = client.registry.getCooldownTimestamps(cmd.info.name);
        const cooldownAmount = cmd.info.cooldown ? cmd.info.cooldown * 1000 : 0;
        if (cmd.info.cooldown) {
            if (timestamps.has(message.author.id)) {
                const currentTime = timestamps.get(message.author.id);
                if (!currentTime) return;

                const expirationTime = currentTime + cooldownAmount;
                if (now < expirationTime) {
                    await message.delete();
                    const timeLeft = (expirationTime - now) / 1000;
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
                        .then(msg => setTimeout(async () => await msg.delete().catch(() => {}), 3000));
                }
            }

            addCooldown = true;
        }

        try {
            var applyCooldown = true;

            const context = {
                message,
                args,
                mentions
            };

            await cmd.run(context as IContext, () => {
                applyCooldown = false;
            });

            if (addCooldown && applyCooldown && !isUserDeveloper(client, message.author.id)) {
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            }
        } catch (error) {
            await cmd.onError(message, error);
        }
    }
    static async findMember(message: Message, args: string[], allowAuthor: boolean = false): Promise<GuildMember | null | undefined> {
        let member;

        member =
            message.mentions.members?.first() ||
            message.guild?.members.cache.get(args[0]) ||
            message.guild?.members.cache.find(m => m.user.id === args[0]) ||
            message.guild?.members.cache.find(m => m.user.tag === args[0]) ||
            message.guild?.members.cache.find(m => m.user.username === args[0]);
        if (member?.partial) {
            member = await member.fetch();
        }
        if (!member && allowAuthor) {
            member = message.member;
        }

        return member;
    }
    static findChannel(message: Message, args: string[], allowChannel: boolean = false): TextChannel | ThreadChannel | Channel | undefined | NewsChannel | PartialDMChannel {
        let channel;

        channel =
            message.mentions.channels.first() ||
            message.guild?.channels.cache.get(args[0]) ||
            message.guild?.channels.cache.find(r => r.name === args[0]) ||
            message.guild?.channels.cache.find(r => r.name.startsWith(args[0]));

        if (!channel && allowChannel) {
            channel = message.channel;
        }
        return channel;
    }
    static findRole(message: Message, args: string[], allowRole: boolean = false): Role | undefined {
        let role;
        role =
            message.mentions.roles.first() ||
            message.guild?.roles.cache.get(args[0]) ||
            message.guild?.roles.cache.find(r => r.name === args[0]) ||
            message.guild?.roles.cache.find(r => r.name.startsWith(args[0]));
        if (!role && allowRole) {
            role = message.member?.roles.highest;
        }
        return role;
    }
}
