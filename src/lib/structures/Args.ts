import { Message } from 'oceanic.js'

import { KamikoClient } from '../KamikoClient'
import { ArgumentContext } from './Argument'
import Command from './Command'

export interface ArgsOptions {
    args: string[]
    message: Message
    client: KamikoClient
    command: Command
}
export class Args {
    args: string[]
    client: KamikoClient
    options: ArgsOptions
    constructor(client: KamikoClient, opts: ArgsOptions) {
        this.client = client
        this.options = opts
        this.args = opts.args
    }

    get(arg: string, opts: Omit<ArgumentContext, 'message' | 'command'> = {}) {
        return this.client.registry.arguments
            .find(a => a.name === arg)
            ?.messageRun(this.args[0], {
                message: this.options.message,
                command: this.options.command,
                ...opts
            })
    }
}
