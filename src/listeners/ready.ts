import Logger from 'lib/utils/Logger'

import { KamikoClient } from '../lib/KamikoClient'
import Listener from '../lib/structures/Listener'

export default class ReadyListener extends Listener<'ready'> {
    constructor(client: KamikoClient) {
        super(client, {
            name: 'ready',
            type: 'on'
        })
    }
    run() {
        Logger.log('SUCCESS', `Logged in as ${this.client.user.tag}!`)
        Logger.log('INFO', `Took ${(this.client.startTime % 60000) / 10000}s to start!`)
    }
}
