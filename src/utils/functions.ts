import 'moment-duration-format'

import { Channel, DMChannel, GuildMember, Message, NewsChannel, PartialDMChannel, Role, TextChannel, ThreadChannel, VoiceChannel } from 'discord.js'
import moment from 'moment-timezone'

import { DiscordClient } from '../lib/structures/DiscordClient'

const isConstructorProxyHandler = {
    construct() {
        return Object.prototype
    }
}

export function isConstructor(func: any, _class: any) {
    try {
        new new Proxy(func, isConstructorProxyHandler)()
        if (!_class) return true
        return func.prototype instanceof _class
    } catch (err) {
        return false
    }
}

/**
 * Checks user is a developer or not.
 * @param client Discord client
 * @param userId Discord id of the user
 */
export function isUserDeveloper(client: DiscordClient, userId: string) {
    return client.config.developers.includes(userId)
}

/**
 * Formats seconds and returns as given format.
 * @param seconds Seconds
 * @param format Custom format of output (Default: "Y [year] M [month] W [week] D [day] H [hour] m [minute] s [second]")
 */
export function formatSeconds(seconds: number, format: string = 'Y [year] M [month] W [week] D [day] H [hour] m [minute] s [second]'): string {
    const str = moment.duration(seconds, 'seconds').format(format)
    const arr = str.split(' ')
    var newStr = ''
    arr.forEach((value, index) => {
        if (isNaN(parseInt(value))) return
        const val = parseInt(value)
        if (val === 0) return
        else {
            const nextIndex = arr[index + 1]
            newStr += `${value} ${nextIndex} `
        }
    })
    return newStr.trim()
}

export function findMember(message: Message, args: string[], allowAuthor: boolean = false): GuildMember | null | undefined {
    let member
    member =
        message.guild?.members.cache.get(getMemberFromMention(message)?.id as string) ||
        message.guild?.members.cache.get(args[0]) ||
        message.guild?.members.cache.find(m => m.user.tag === args[0]) ||
        message.guild?.members.cache.find(m => m.user.username === args[0])
    if (!member && allowAuthor) {
        member = message.member
    }

    return member
}

export function findChannel(
    message: Message,
    args: string[],
    allowChannel: boolean = false
): TextChannel | ThreadChannel | Channel | undefined | NewsChannel | DMChannel | VoiceChannel | PartialDMChannel {
    let channel

    channel =
        message.mentions.channels.first() ||
        message.guild?.channels.cache.get(args[0]) ||
        message.guild?.channels.cache.find(r => r.name === args[0]) ||
        message.guild?.channels.cache.find(r => r.name.startsWith(args[0]))

    if (!channel && allowChannel) {
        channel = message.channel
    }
    return channel
}

export function findRole(message: Message, args: string[], allowRole: boolean = false): Role | undefined {
    let role
    role =
        message.mentions.roles.first() ||
        message.guild?.roles.cache.get(args[0]) ||
        message.guild?.roles.cache.find(r => r.name === args[0]) ||
        message.guild?.roles.cache.find(r => r.name.startsWith(args[0]))
    if (!role && allowRole) {
        role = message.member?.roles.highest
    }
    return role
}

export function getMemberFromMention(message: Message) {
    const mention = message.mentions.members?.first() || message.mentions.members?.first(1)[1]
    if (!mention) return
    const obj = {
        id: mention?.id,
        user: message.client.users.cache.get(mention.id),
        member: mention
    }

    return obj
}

export function createOptionHandler(structureName: string, structureOptions: any, options: any = {}) {
    if (!options.optionalOptions && typeof options === 'undefined') {
        throw new Error(`The options of structure "${structureName}" is required.`)
    }

    return {
        optional(name: any, defaultValue: any = null) {
            const value = structureOptions[name]

            return typeof value === 'undefined' ? defaultValue : value
        },

        required(name: any) {
            const value = structureOptions[name]

            if (typeof value === 'undefined') {
                throw new Error(`The option "${name}" of structure "${structureName}" is required.`)
            }
            return value
        }
    }
}
