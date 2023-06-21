import 'dotenv/config'

import Logger from 'lib/utils/Logger'
import { ApplicationCommandOptionsSubCommand, ApplicationCommandTypes, CreateApplicationCommandOptions } from 'oceanic.js'

import { KamikoClient } from '../lib/KamikoClient'
import Listener from '../lib/structures/Listener'

interface GroupObject {
    [group: string]: ApplicationCommandOptionsSubCommand[]
}
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
        this.registerApplicationCommands()
    }
    async registerApplicationCommands() {
        const groups = this.client.registry.getAllGroupNames()
        const availableCommands = [...this.client.registry.commands.filter(c => c.registerSlashCommand)]
        let data: CreateApplicationCommandOptions[] = []
        let groupData: GroupObject = {}

        for (const group of groups) {
            groupData[group.toLowerCase()] = []
        }
        for (const cmd of availableCommands) {
            if (cmd.registerSlashCommand) {
                const cmdData = cmd.registerSlashCommand().toJSON() as ApplicationCommandOptionsSubCommand

                groupData[cmd.info.group.toLowerCase()].push({
                    name: cmdData.name,
                    type: cmdData.type,
                    description: cmdData.description,
                    options: cmdData.options ?? []
                })
            }
        }
        for (const group of groups) {
            data.push({
                name: group.toLowerCase(),
                description: `${group} commands`,
                type: ApplicationCommandTypes.CHAT_INPUT,
                options: groupData[group.toLowerCase()]
            })
        }
        if (process.env.MODE === 'DEVELOPMENT') {
            this.client.application.bulkEditGuildCommands('883434541560238160', data)
            Logger.log('INFO', 'Registered application commands')
        } else {
            this.client.application.bulkEditGlobalCommands(data)
            Logger.log('INFO', 'Registered application commands')
        }
    }
}
