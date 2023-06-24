import 'dotenv/config'

import { Client, ClientOptions, Message } from 'oceanic.js'

import { PrismaClient } from '@prisma/client'

import Registry from './structures/Registry'
import Logger from './utils/Logger'

export class KamikoClient extends Client {
    /**
     * Logger for the client
     */
    logger: Logger
    /**
     * registry for the client
     *
     */
    registry: Registry

    /**
     * The database for the client
     */
    database: PrismaClient

    constructor(options: ClientOptions) {
        super(options)

        /**
         * The logger
         */
        this.logger = Logger

        /**
         * The registry
         */
        this.registry = new Registry(this)

        this.registry.registerAll()

        this.database = new PrismaClient()
    }

    async start() {
        await this.database.$connect().then(c => Logger.log('INFO', 'Connected to database!'))
        this.connect()
    }

    async fetchPrefix(message: Message): Promise<string> {
        const guild = await this.database.guild.findUnique({
            where: {
                id: message.guild?.id
            }
        })
        if (!guild) {
            await this.database.guild.create({
                data: {
                    id: message.guildID as string,
                    prefix: process.env.PREFIX,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            })
        }
        return guild ? guild.prefix : (process.env.PREFIX as string)
    }
}
