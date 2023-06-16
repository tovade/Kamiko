import { Message } from 'oceanic.js'

import { Result } from '@sapphire/result'

import { ArgumentError, ArgumentErrorOptions } from '../errors/ArgumentError'
import { KamikoClient } from '../KamikoClient'
import Command from './Command'

export abstract class Argument {
    /**
     * The client
     */
    public client: KamikoClient

    /**
     * The name of the argument
     * @example
     * ```ts
     * export class MyArgument extends Argument {
     *    constructor(client: KamikoClient) {
     *      super(client, 'myArgument')
     *   }
     * }
     * ```
     */
    public name: string
    constructor(client: KamikoClient, name: string) {
        this.client = client
        this.name = name
    }
    public abstract messageRun(content: string, context: ArgumentContext)

    ok(value: any) {
        return Result.ok(value).unwrapRaw()
    }
    error(options: ArgumentErrorOptions) {
        return Result.err(new ArgumentError(options)).unwrapRaw()
    }
}
export interface ArgumentContext {
    /**
     * The message that triggered the command
     */
    message: Message

    /**
     * The command
     */
    command: Command

    minimum?: number
    maximum?: number
    inclusive?: boolean
}
