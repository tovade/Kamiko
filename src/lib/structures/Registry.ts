import { ClientEvents, Collection } from 'oceanic.js'
import path from 'path'
import requireAll from 'require-all'

import { isConstructor } from '../../utils/functions'
import RegistryError from '../errors/RegistryError'
import { KamikoClient } from '../KamikoClient'
import Logger from '../utils/Logger'
import { Argument } from './Argument'
import Command from './Command'
import Listener from './Listener'

export default class Registry {
    /**
     * Discord client.
     */
    private client: KamikoClient

    /**
     * Collection for command registration.
     */
    public commands: Collection<string, Command>

    /**
     * Command paths
     */
    private commandPaths: string[] = []

    /**
     * Collection for event registration.
     */
    public listeners: Collection<string, Listener>

    /**
     * Collection for helper registration.
     */
    public arguments: Collection<string, Argument>

    /**
     * Event paths
     */
    private listenerPaths: string[] = []

    /**
     * Collection for command cooldown registration.
     */
    public cooldowns: Collection<string, Collection<string, number>>

    /**
     * Collection for command group registration.
     */
    public groups: Collection<string, string[]>
    /**
     * Collection for aliases
     */
    public aliases: Collection<string, Command>

    /**
     * Creates instance for all collections.
     */
    private newCollections() {
        this.commands = new Collection<string, Command>()
        this.listeners = new Collection<string, Listener>()
        this.cooldowns = new Collection<string, Collection<string, number>>()
        this.groups = new Collection<string, string[]>()
        this.aliases = new Collection<string, Command>()
        this.arguments = new Collection<string, Argument>()
    }

    constructor(client: KamikoClient) {
        this.client = client
        this.newCollections()
    }

    /**
     * Registers single event.
     * @param event Event object
     */
    private registerEvent(listener: Listener) {
        if (this.listeners.some(e => e.name === listener.name)) throw new RegistryError(`A event with the name "${listener.name}" is already registered.`)

        this.listeners.set(listener.name, listener)
        listener.emitter
            ? listener.emitter[listener.type](listener.name, (...params: any[]) => listener.run(...params))
            : this.client[listener.type](listener.name as keyof ClientEvents, (...params: any) => listener.run(...params))
        Logger.log('INFO', `Event "${listener.name}" loaded.`)
    }
    /**
     * Registers all events.
     */
    private registerAllEvents() {
        const events: any[] = []

        if (this.listenerPaths.length)
            this.listenerPaths.forEach(p => {
                delete require.cache[p]
            })

        requireAll({
            dirname: path.join(__dirname, '../../listeners'),
            recursive: true,
            filter: /\w*.[tj]s/g,
            resolve: x => events.push(x),
            map: (name, filePath) => {
                if (filePath.endsWith('.ts') || filePath.endsWith('.js')) this.listenerPaths.push(path.resolve(filePath))
                return name
            }
        })

        for (let event of events) {
            const valid = isConstructor(event, Listener) || isConstructor(event.default, Listener) || event instanceof Listener || event.default instanceof Listener
            if (!valid) continue

            if (isConstructor(event, Listener)) event = new event(this.client)
            else if (isConstructor(event.default, Listener)) event = new event.default(this.client)
            if (!(event instanceof Listener)) throw new RegistryError(`Invalid event object to register: ${event}`)

            this.registerEvent(event)
        }
    }

    /**
     * Registers a single argument
     * @param argument Argument object
     */
    private registerArgument(argument: Argument) {
        if (this.arguments.some(e => e.name === argument.name)) throw new RegistryError(`An argument with the name "${argument.name}" is already registered.`)

        this.arguments.set(argument.name, argument)
        Logger.log('INFO', `Argument "${argument.name}" loaded.`)
    }
    /**
     * Registers all arguments.
     */
    private registerAllArguments() {
        const argumentes: any[] = []
        requireAll({
            dirname: path.join(__dirname, '../../arguments'),
            recursive: true,
            filter: /\w*.[tj]s/g,
            resolve: x => argumentes.push(x),
            map: name => {
                return name
            }
        })

        for (let argument of argumentes) {
            const valid = isConstructor(argument, Argument) || isConstructor(argument.default, Argument) || argument instanceof Argument || argument.default instanceof Argument
            if (!valid) continue

            if (isConstructor(argument, Argument)) argument = new argument(this.client)
            else if (isConstructor(argument.default, Argument)) argument = new argument.default(this.client)
            if (!(argument instanceof Argument)) throw new RegistryError(`Invalid event object to register: ${argument}`)

            this.registerArgument(argument)
        }
    }
    /**
     * Registers single command.
     * @param command Command object
     */
    private registerCommand(command: Command) {
        if (
            this.commands.some(x => {
                if (x.info.name === command.info.name) return true
                else if (x.info.aliases && x.info.aliases.includes(command.info.name)) return true
                else return false
            })
        )
            throw new RegistryError(`A command with the name/alias "${command.info.name}" is already registered.`)

        if (command.info.aliases) {
            for (const alias of command.info.aliases) {
                if (
                    this.commands.some(x => {
                        if (x.info.name === alias) return true
                        else if (x.info.aliases && x.info.aliases.includes(alias)) return true
                        else return false
                    })
                )
                    throw new RegistryError(`A command with the name/alias "${alias}" is already registered.`)
                this.aliases.set(alias, command)
            }
        }
        this.commands.set(command.info.name, command)
        if (!this.groups.has(command.info.group)) this.groups.set(command.info.group, [command.info.name])
        else {
            const groups = this.groups.get(command.info.group) as string[]
            groups.push(command.info.name)
            this.groups.set(command.info.group, groups)
        }
    }
    /**
     * Registers all commands.
     */
    private registerAllCommands() {
        const commands: any[] = []

        if (this.commandPaths.length)
            this.commandPaths.forEach(p => {
                delete require.cache[p]
            })

        requireAll({
            dirname: path.join(__dirname, '../../commands'),
            recursive: true,
            filter: /\w*.[tj]s/g,
            resolve: x => commands.push(x),
            map: (name, filePath) => {
                if (filePath.endsWith('.ts') || filePath.endsWith('.js')) this.commandPaths.push(path.resolve(filePath))
                return name
            }
        })

        for (let command of commands) {
            const valid = isConstructor(command, Command) || isConstructor(command.default, Command) || command instanceof Command || command.default instanceof Command
            if (!valid) continue

            if (isConstructor(command, Command)) command = new command(this.client)
            else if (isConstructor(command.default, Command)) command = new command.default(this.client)
            if (!(command instanceof Command)) throw new RegistryError(`Invalid command object to register: ${command}`)
            this.registerCommand(command)
        }
        Logger.log('INFO', `Registered ${commands.length} command(s).`)
    }

    /**
     * Finds and returns the command by name or alias.
     * @param command Name or alias
     */
    findCommand(command: string): Command | undefined {
        return this.commands.get(command) || [...this.commands.values()].find(cmd => cmd.info.aliases && cmd.info.aliases.includes(command))
    }

    /**
     * Finds and returns the commands in group by group name
     * @param group Name of group
     */
    findCommandsInGroup(group: string): string[] | undefined {
        return this.groups.get(group)
    }

    /**
     * Returns all group names.
     */
    getAllGroupNames() {
        return [...this.groups.keys()]
    }

    /**
     * Returns timestamps of the command.
     * @param commandName Name of the command
     */
    getCooldownTimestamps(commandName: string): Collection<string, number> {
        if (!this.cooldowns.has(commandName)) this.cooldowns.set(commandName, new Collection<string, number>())
        return this.cooldowns.get(commandName) as Collection<string, number>
    }

    /**
     * Registers events and commands.
     */
    registerAll() {
        this.registerAllCommands()
        this.registerAllEvents()
        this.registerAllArguments()
    }

    /**
     * Removes all events from client then reregisters events & commands. Resets groups and cooldowns.
     *
     * Call this function while client is offline.
     */
    reregisterAll() {
        const allEvents = [
            ...this.listeners
                .filter(e => isEventKey(e.name))
                .map(ev => ev.name)
                .values()
        ]
        allEvents.forEach(event => this.client.removeAllListeners(event as keyof ClientEvents))
        this.newCollections()

        this.registerAll()
    }
}
function isEventKey(key: string): key is keyof ClientEvents {
    return key in ({} as unknown as ClientEvents)
}
