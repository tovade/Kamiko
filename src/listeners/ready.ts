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
        console.log(`Logged in as ${this.client.user.tag}`)
    }
}
