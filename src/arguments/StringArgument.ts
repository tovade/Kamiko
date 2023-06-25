import { KamikoClient } from 'lib/KamikoClient'
import { Argument, ArgumentContext } from 'lib/structures/Argument'

export default class StringArgument extends Argument {
    constructor(client: KamikoClient) {
        super(client, 'string')
    }
    public messageRun(content: string, context: ArgumentContext) {
        return typeof content === 'string'
            ? this.ok(content)
            : this.error({
                  message: 'Invalid string.',
                  identifier: 'string',
                  type: 'string',
                  argument: this
              })
    }
}
