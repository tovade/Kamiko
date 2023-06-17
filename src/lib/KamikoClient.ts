import { Client, ClientOptions } from 'oceanic.js'

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

    start() {
        this.database.$connect()
        this.connect()
    }
}
