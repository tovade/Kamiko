import { ApplicationCommandData, ApplicationCommandOption } from 'discord.js'

import Logger from '../classes/Logger'
import config from '../config/config'
import { InitDatabase } from '../lib/database/DatabaseConnection'
import { DiscordClient } from '../lib/structures/DiscordClient'
import Event from '../lib/structures/Event'

export default class ReadyEvent extends Event {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'ready',
            type: 'on'
        })
    }

    async run() {
        InitDatabase.Init(this.client)
        Logger.log('SUCCESS', `Logged in as "${this.client.user?.tag}".`)
        this.client.user?.setActivity({ name: 'Who is more retarted.', type: 'COMPETING' })

        const registry = this.client.registry
        const groupKeys = registry.getAllGroupNames()
        let ToRegister = []
        for (const group of groupKeys) {
            const cmdArr = [...this.client.registry.commands.keys()]
            const NewArr = []
            for (const cmd of cmdArr) {
                const cmde = this.client.registry.commands.get(cmd)
                if (cmde?.info.type === 'SLASH' || cmde?.info.type === 'BOTH') {
                    NewArr.push(cmde)
                } else {
                    continue
                }
            }
            const cmds = NewArr.filter(cmd => cmd?.info.group === group)
            if (!cmds.length) continue
            const slashData: ApplicationCommandData = {
                name: group.toLowerCase(),
                description: `${group} category`,
                type: 'CHAT_INPUT',
                options: []
            }
            cmds.forEach((commnd, i) => {
                const d: ApplicationCommandOption = { name: commnd.info.name, description: commnd.info.description as string, type: 'SUB_COMMAND', options: [] }
                if (commnd.info.slashOptions) {
                    d.options = commnd.info.slashOptions as any
                    return slashData.options?.push(d)
                } else {
                    return slashData.options?.push(d)
                }
            })
            ToRegister.push(slashData)
        }
        ToRegister.forEach(obj => {
            if (config.devmode) {
                this.client.guilds.cache.get('883434541560238160')?.commands.create(obj as any)
            } else {
                this.client.application?.commands.create(obj as any)
            }
        })
    }
}
