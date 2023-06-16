import { Argument } from '../structures/Argument'

export interface ArgumentErrorOptions {
    argument: Argument
    identifier: string
    type: string
    message: string
}
export class ArgumentError extends Error {
    /**
     * An identifier, useful to localize emitted errors.
     */
    public readonly identifier: string

    /**
     * The data that was passed to the argument.
     */
    public readonly data: ArgumentErrorOptions

    public constructor(options: ArgumentErrorOptions) {
        super(options.message)
        this.identifier = options.identifier

        this.data = options
    }

    public override get name(): string {
        return 'ArgumentError'
    }
}
