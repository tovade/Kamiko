import { AnyTextableChannel, Message, Uncached } from 'oceanic.js'

import { KamikoClient } from '../../lib/KamikoClient'
import { Args } from '../../lib/structures/Args'
import Command from '../../lib/structures/Command'

export default class PingCommand extends Command {
    constructor(client: KamikoClient) {
        super(client, {
            name: 'ping',
            description: 'Pong!',
            group: 'General'
        })
    }
    run(message: Message<AnyTextableChannel | Uncached>, args: Args) {
        console.log(args.get('string'))
    }
}
