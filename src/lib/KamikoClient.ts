import { Client, ClientOptions } from 'oceanic.js'

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
    }
}
