import { Client, HexColorString, Intents, IntentsString } from 'discord.js';

import Logger from '../../classes/Logger';
import Registry from '../../classes/Registry';
import config from '../../config/config';
import { IConfig } from '../../utils/interfaces';
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

    public moderator: ModClient

    public warnClient: WarnClient

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
    }
}
