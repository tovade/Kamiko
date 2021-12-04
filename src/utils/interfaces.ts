import {
    ApplicationCommandOption, Channel, GuildMember, HexColorString, Message, NewsChannel,
    PartialDMChannel, PermissionString, Role, TextChannel, ThreadChannel, User, VoiceChannel
} from 'discord.js';

/**
 * Config interface for client.
 */
export interface IConfig {
    /** Token of the client */
    token: string

    /** Prefix of the client */
    prefix: string

    /** Developer ids of the client */
    developers: string[]

    /**
     * Status of sending error message when user try to run unknown command.
     */
    unknownErrorMessage: boolean

    /**
     * The main color
     */
    color: HexColorString

    /**
     * The mongodb url
     */
    mongoUrl: string

    /**
     * channels for the bot
     */
    channels: any
}

/**
 * Information interface for commands.
 */
export interface ICommandInfo {
    /** Name of the command */
    name: string

    /** Group name of the command */
    group: string

    /** Aliases of the command */
    aliases?: string[]

    /** Example usages */
    examples?: string[]

    /** Description of the command */
    description?: string

    /**
     * Time to wait for each use (seconds)
     *
     * Developers are not affected
     */
    cooldown?: number

    /** Status of the command */
    enabled?: boolean

    /**
     * If enabled, command only runs in nsfw channels
     *
     * Developers are not affected
     */
    onlyNsfw?: boolean

    /** Requirements of the command */
    context?: ICommandRequire

    /**
     * Wether to use the command as a slash command or a message command
     */
    type?: 'MESSAGE' | 'BOTH' | 'SLASH'

    slashOptions?: ApplicationCommandOption[]
}

/**
 * Requirement interface for commands.
 */
export interface ICommandRequire {
    /** If enabled, command requires developer permission to run */
    developer?: boolean

    /**
     * Command requires permission flags to run
     *
     * Developers are not affected
     */
    permissions?: PermissionString[]

    /**
     * Command requires a member to be runnable
     */
    member?: boolean

    /**
     * Command requires a role to be runnable
     */
    role?: boolean

    /**
     * Command requires a channel to be runnable
     */
    channel?: boolean

    /**
     * Command requires amount of arguments needed to be runnable
     */
    args?: number

    /**
     * If the command can only be run in a guild.
     */
    guildOnly?: boolean
}
export interface IContext {
    /**
     * Message object
     */
    message: Message

    /**
     * Arguments
     */
    args: string[]

    /**
     * Mentions
     */
    mentions: IMentions
}
export interface IMentions {
    /**
     * member mention
     */
    member: GuildMember | null | undefined

    /**
     * Channel mention
     */
    channel: TextChannel | ThreadChannel | Channel | undefined | NewsChannel | PartialDMChannel

    /**
     * Role mention
     */
    role: Role | undefined
}
export interface Permissions {
    ADMINISTRATOR: string
    VIEW_AUDIT_LOG: string
    VIEW_GUILD_INSIGHTS: string
    MANAGE_GUILD: string
    MANAGE_ROLES: string
    MANAGE_CHANNELS: string
    KICK_MEMBERS: string
    BAN_MEMBERS: string
    CREATE_INSTANT_INVITE: string
    CHANGE_NICKNAME: string
    MANAGE_NICKNAMES: string
    MANAGE_EMOJIS: string
    MANAGE_WEBHOOKS: string
    VIEW_CHANNEL: string
    SEND_MESSAGES: string
    SEND_TTS_MESSAGES: string
    MANAGE_MESSAGES: string
    EMBED_LINKS: string
    ATTACH_FILES: string
    READ_MESSAGE_HISTORY: string
    MENTION_EVERYONE: string
    USE_EXTERNAL_EMOJIS: string
    ADD_REACTIONS: string
    CONNECT: string
    SPEAK: string
    STREAM: string
    MUTE_MEMBERS: string
    DEAFEN_MEMBERS: string
    MOVE_MEMBERS: string
    USE_VAD: string
    PRIORITY_SPEAKER: string
}
