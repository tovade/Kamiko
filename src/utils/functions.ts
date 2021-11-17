import 'moment-duration-format'

import moment from 'moment-timezone'

import { DiscordClient } from '../lib/structures/DiscordClient'
import { Role, Message, GuildMember, Channel, TextChannel, ThreadChannel, NewsChannel, PartialDMChannel } from 'discord.js'
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

export async function findMember(message: Message, args: string[], allowAuthor: boolean = false): Promise<GuildMember | null | undefined> {
    let member

    member =
        message.mentions.members?.first() ||
        message.guild?.members.cache.get(args[0]) ||
        message.guild?.members.cache.find(m => m.user.id === args[0]) ||
        message.guild?.members.cache.find(m => m.user.tag === args[0]) ||
        message.guild?.members.cache.find(m => m.user.username === args[0])
    if (member?.partial) {
        member = await member.fetch()
    }
    if (!member && allowAuthor) {
        member = message.member
    }

    return member
}

export function findChannel(message: Message, args: string[], allowChannel: boolean = false): TextChannel | ThreadChannel | Channel | undefined | NewsChannel | PartialDMChannel {
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
