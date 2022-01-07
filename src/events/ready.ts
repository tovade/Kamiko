import { ApplicationCommandData, ApplicationCommandOption } from 'discord.js';

import Logger from '../classes/Logger';
import config from '../config/config';
import { DiscordClient } from '../lib/structures/DiscordClient';
import Event from '../lib/structures/Event';

export default class ReadyEvent extends Event {
    constructor(client: DiscordClient) {
        super(client, 'ready')
    }

    async run() {
        Logger.log('SUCCESS', `Logged in as "${this.client.user?.tag}".`)
        this.client.user?.setActivity({ name: 'Who is more retarted.', type: 'COMPETING' })

        const registry = this.client.registry
        const groupKeys = registry.getAllGroupNames()
        let ToRegister: any = []
        for (const group of groupKeys) {
            const cmdArr = [...this.client.registry.commands.keys()]
            const NewArr: string[] = []
            for (const cmd of cmdArr) {
                const cmde = this.client.registry.commands.get(cmd)
                if (cmde?.info.type === 'SLASH' || cmde?.info.type === 'BOTH') {
                    NewArr.push(cmde as any)
                } else {
                    continue
                }
            }
            const cmds: string[] = NewArr.filter((cmd: any) => cmd.info.group === group)
            if (!cmds.length) continue
            const slashData: ApplicationCommandData = {
                name: group.toLowerCase(),
                description: `${group} category`,
                type: 'CHAT_INPUT',
                options: []
            }
            cmds.forEach((commnd: any, i: any) => {
                const d: ApplicationCommandOption = { name: commnd.info.name, description: commnd.info.description as string, type: 'SUB_COMMAND', options: [] }
                if (commnd.info.slashOptions) {
                    d.options = commnd.info.slashOptions as any
                    return slashData.options?.push(d as any)
                } else {
                    return slashData.options?.push(d as any)
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
