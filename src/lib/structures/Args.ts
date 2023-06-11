import { DiscordClient } from './DiscordClient'

export class Args {
    args: string[]
    client: DiscordClient
    constructor(client: DiscordClient, args: string[]) {
        ;(this.client = client), (this.args = args)
    }

    /**
     * Get all flags in the message
     * @returns {string[]} flags detected in the message
     */
    getFlags(): string[] {
        const flags = this.args.filter(arg => arg.startsWith('--')).map(str => str.replace('--', ''))
        return flags
    }
    /**
     * all args without the flags
     * @returns {string[]} args without flags
     */
    getAll(): string[] {
        // args without flags
        const args = this.args.filter(arg => !arg.startsWith('--'))
        return args
    }
}
