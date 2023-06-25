import { KamikoClient } from 'lib/KamikoClient'
import { DefaultConfig } from 'lib/utils/Config'

import { EmbedBuilder } from '@oceanicjs/builders'

export class KamikoEmbed extends EmbedBuilder {
    constructor() {
        super()
    }
    addDefaults(client: KamikoClient) {
        this.setColor(DefaultConfig.color)
        this.setFooter(client.user?.username, client.user?.avatarURL('png'))
        return this
    }
}
