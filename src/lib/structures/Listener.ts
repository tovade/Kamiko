import { ClientEvents } from 'oceanic.js'

import { KamikoEvents } from '../../utils/types'
import { KamikoClient } from '../KamikoClient'

export interface ProcessEvents {
    exit: string
    uncaughtException: string
    unhandledRejection: string
}

export interface ListenerOptions {
    emitter?: any
    name: keyof ClientEvents | keyof KamikoEvents
    type: 'on' | 'once'
}
export default abstract class Listener<E extends keyof ClientEvents | keyof KamikoEvents | string = ''> {
    /**
     * Discord client.
     */
    readonly client: KamikoClient

    /**
     * Name of the event.
     */
    readonly name: string

    /**
     * Emitter of the event.
     */
    readonly emitter: any

    readonly type: 'on' | 'once'

    constructor(client: KamikoClient, opts: ListenerOptions) {
        this.client = client
        this.name = opts.name
        this.emitter = opts.emitter
        this.type = opts.type
    }

    /**
     * Runs the event.
     * @param params Event parameters from [discord.js.org](https://discord.js.org/#/docs/main/stable/class/Client)
     */
    abstract run(...args: E extends keyof ClientEvents ? ClientEvents[E] : unknown[]): any | Promise<any>
}
