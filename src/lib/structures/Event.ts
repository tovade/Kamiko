import { ClientEvents } from 'discord.js'
import { EventEmitter } from 'events'

import { DiscordClient } from './DiscordClient'

export interface ProcessEvents {
    exit: string
    uncaughtException: string
    unhandledRejection: string
}

export interface EventOptions {
    emitter?: any
    name: string
    type: 'on' | 'once'
}
export default abstract class Event {
    /**
     * Discord client.
     */
    readonly client: DiscordClient

    /**
     * Name of the event.
     */
    readonly name: string

    /**
     * Emitter of the event.
     */
    readonly emitter: any

    readonly type: 'on' | 'once'

    constructor(client: DiscordClient, opts: EventOptions) {
        this.client = client
        this.name = opts.name
        this.emitter = opts.emitter
        this.type = opts.type
    }

    /**
     * Runs the event.
     * @param params Event parameters from [discord.js.org](https://discord.js.org/#/docs/main/stable/class/Client)
     */
    abstract run(...params: any | undefined): any | Promise<any>
}
