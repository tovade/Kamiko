import { KamikoClient } from 'lib/KamikoClient'
import { Precondition } from 'lib/structures/PreCondition'
import { AnyTextableChannel, CommandInteraction, Message, Uncached } from 'oceanic.js'

import { Err, Ok } from '@sapphire/result'

export default class OwnerPrecondition extends Precondition {
    constructor(client: KamikoClient) {
        super(client, 'OwnerOnly')
    }

    public messageRun(message: Message<AnyTextableChannel | Uncached>): Ok<any> | Err<any> {
        return message.author.id === '155149108183695360' ? this.ok(true) : this.error('You are not the owner')
    }
    public interactionRun(interaction: CommandInteraction): Ok<any> | Err<any> {
        return interaction.user.id === '155149108183695360' ? this.ok(true) : this.error('You are not the owner')
    }
}
