import { MessageEmbed, PermissionString } from 'discord.js';
import moment from 'moment';

import Command from '../../lib/structures/Command';
import { DiscordClient } from '../../lib/structures/DiscordClient';
import { IContext } from '../../utils/interfaces';

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'roleinfo',
            group: 'Information',
            description: 'Get info about a role.',
            examples: ['!roleinfo @Community'],
            context: {
                role: true
            }
        })
    }
    async run(ctx: IContext) {
        try {
            const role = ctx.mentions.role
            const { message } = ctx
            const permissions: any = {
                ADMINISTRATOR: 'Administrator',
                VIEW_AUDIT_LOG: 'View Audit Log',
                VIEW_GUILD_INSIGHTS: 'View Server Insights',
                MANAGE_GUILD: 'Manage Server',
                MANAGE_ROLES: 'Manage Roles',
                MANAGE_CHANNELS: 'Manage Channels',
                KICK_MEMBERS: 'Kick Members',
                BAN_MEMBERS: 'Ban Members',
                CREATE_INSTANT_INVITE: 'Create Invite',
                CHANGE_NICKNAME: 'Change Nickname',
                MANAGE_NICKNAMES: 'Manage Nicknames',
                MANAGE_EMOJIS: 'Manage Emojis',
                MANAGE_WEBHOOKS: 'Manage Webhooks',
                VIEW_CHANNEL: 'Read Text Channels & See Voice Channels',
                SEND_MESSAGES: 'Send Messages',
                SEND_TTS_MESSAGES: 'Send TTS Messages',
                MANAGE_MESSAGES: 'Manage Messages',
                EMBED_LINKS: 'Embed Links',
                ATTACH_FILES: 'Attach Files',
                READ_MESSAGE_HISTORY: 'Read Message History',
                MENTION_EVERYONE: 'Mention @everyone, @here, and All Roles',
                USE_EXTERNAL_EMOJIS: 'Use External Emojis',
                ADD_REACTIONS: 'Add Reactions',
                CONNECT: 'Connect',
                SPEAK: 'Speak',
                STREAM: 'Video',
                MUTE_MEMBERS: 'Mute Members',
                DEAFEN_MEMBERS: 'Deafen Members',
                MOVE_MEMBERS: 'Move Members',
                USE_VAD: 'Use Voice Activity',
                PRIORITY_SPEAKER: 'Priority Speaker'
            }

            const rolePermissions = role?.permissions.toArray()
            const finalPermissions: string[] = []
            for (const permission in permissions) {
                if (rolePermissions?.includes(permission as PermissionString)) finalPermissions.push(`✔️ ${permissions[permission]}`)
                else finalPermissions.push(`❌ ${permissions[permission]}`)
            }

            const position = `\`${message.guild?.roles.cache.size! - role?.position!}\`/\`${message.guild?.roles.cache.size}\``

            const embed = new MessageEmbed()

                .setTitle(`Role Info`)
                .setThumbnail(message.guild?.iconURL({ dynamic: true, size: 1024 }) as string)
                .addField('Name', `<@&${role?.id}>`, true)
                .addField('ID', `\`${role?.id}\``, true)
                .addField('Position', `${position}`, true)
                .addField('Mentionable', role?.mentionable ? '`yes`' : '`no`', true)
                .addField('Bot Role', role?.managed ? '`yes`' : '`no`', true)
                .addField('Visible', role?.hoist ? '`yes`' : '`no`', true)
                .addField('Color', `\`${role?.hexColor.toUpperCase()}\``, true)
                .addField('Creation Date', `\`${moment(role?.createdAt).format('DD/MMM/YYYY')}\``, true)
                .addField('Permissions', `\`\`\`diff\n${finalPermissions.join('\n')}\`\`\``)

            message.channel.send({ embeds: [embed] })
        } catch (error: any) {
            ctx.message.channel.send({ content: error?.message as string })
        }
    }
}
