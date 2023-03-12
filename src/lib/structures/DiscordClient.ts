import { Client, HexColorString, Intents, IntentsString } from 'discord.js';

import Logger from '../../classes/Logger';
import Registry from '../../classes/Registry';
import config from '../../config/config';
import { IConfig } from '../../utils/interfaces';
import VSCodeExtensions from '../api/vscode';
import { GuildDatabaseManager } from '../database/Manager/GuildManager';
import { UserDatabaseManager } from '../database/Manager/UserManager';
import ModClient, { WarnClient } from '../mod/ModClient';

export class DiscordClient extends Client {
    /**
     * Registry of the client.
     */
    readonly registry: Registry

    /**
     * Config of the client.
     */
    readonly config: IConfig

    /**
     * Client databases
     */
    public databases = {
        guilds: new GuildDatabaseManager(),
        users: new UserDatabaseManager()
    }

    public moderator: ModClient

    public warnClient: WarnClient

    public custom_api: {
        vscode: VSCodeExtensions
    }
    /**
     * Logger for the client
     */
    logger: any

    constructor(intents: number[]) {
        super({ intents })

        /**
         * Setting up client's config.
         */
        this.config = {
            token: process.env.TOKEN as string,
            prefix: process.env.PREFIX as string,
            developers: JSON.parse(process.env.DEVELOPERS as string) as string[],
            unknownErrorMessage: JSON.parse(process.env.UNKNOWN_COMMAND_ERROR as string),
            color: `#${process.env.MAINCOLOR}` as HexColorString,
            mongoUrl: process.env.MONGODB as string,
            channels: config.channels
        }

        /**
         * Creating new registry class.
         */
        this.registry = new Registry(this)

        /**
         * Registering events and commands.
         */
        this.registry.registerAll()

        /**
         * The logger
         */
        this.logger = Logger

        /**
         * The moderation client for the actions!
         */
        this.moderator = new ModClient(this)

        this.warnClient = new WarnClient(this)

        this.custom_api = {
            vscode: new VSCodeExtensions()
        }
    }
}
