import { ThreadChannel, HexColorString, Channel, PartialDMChannel, GuildMember, Message, NewsChannel, PermissionString, Role, TextChannel, User, VoiceChannel } from 'discord.js';

/**
 * Config interface for client.
 */
export interface IConfig {
    /** Token of the client */
    token: string;

    /** Prefix of the client */
    prefix: string;

    /** Developer ids of the client */
    developers: string[];

    /**
     * Status of sending error message when user try to run unknown command.
     */
    unknownErrorMessage: boolean;

    /**
     * The main color
     */
    color: HexColorString;
}

/**
 * Information interface for commands.
 */
export interface ICommandInfo {
    /** Name of the command */
    name: string;

    /** Group name of the command */
    group: string;

    /** Aliases of the command */
    aliases?: string[];

    /** Example usages */
    examples?: string[];

    /** Description of the command */
    description?: string;

    /**
     * Time to wait for each use (seconds)
     *
     * Developers are not affected
     */
    cooldown?: number;

    /** Status of the command */
    enabled?: boolean;

    /**
     * If enabled, command only runs in nsfw channels
     *
     * Developers are not affected
     */
    onlyNsfw?: boolean;

    /** Requirements of the command */
    require?: ICommandRequire;
}

/**
 * Requirement interface for commands.
 */
export interface ICommandRequire {
    /** If enabled, command requires developer permission to run */
    developer?: boolean;

    /**
     * Command requires permission flags to run
     *
     * Developers are not affected
     */
    permissions?: PermissionString[];

    /**
     * Command requires a member to be runnable
     */
    member?: boolean;

    /**
     * Command requires a role to be runnable
     */
    role?: boolean;

    /**
     * Command requires a channel to be runnable
     */
    channel?: boolean;

    /**
     * Command requires amount of arguments needed to be runnable
     */
    args?: number;
}
export interface IContext {
    /**
     * Message object
     */
    message: Message;

    /**
     * Arguments
     */
    args: string[];

    /**
     * Mentions
     */
    mentions: IMentions;
}
export interface IMentions {
    /**
     * member mention
     */
    member: GuildMember | null | undefined;

    /**
     * Channel mention
     */
    channel: TextChannel | ThreadChannel | Channel | undefined | NewsChannel | PartialDMChannel;

    /**
     * Role mention
     */
    role: Role | undefined;
}