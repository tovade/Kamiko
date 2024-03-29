import { ClientEvents, Collection } from 'discord.js'
import path from 'path'
import requireAll from 'require-all'

import RegistryError from '../lib/errors/RegistryError'
import Command from '../lib/structures/Command'
import { DiscordClient } from '../lib/structures/DiscordClient'
import Event from '../lib/structures/Event'
import { Helper } from '../lib/structures/Helper'
import SelectMenu from '../lib/structures/SelectMenuInteraction'
import { isConstructor } from '../utils/functions'
import Logger from './Logger'

export default class Registry {
    /**
     * Discord client.
     */
    private client: DiscordClient

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
    public events: Collection<string, Event>

    /**
     * Collection for helper registration.
     */
    public helpers: Collection<string, Helper>

    /**
     * Event paths
     */
    private eventPaths: string[] = []

    /**
     * Collection for command cooldown registration.
     */
    public cooldowns: Collection<string, Collection<string, number>>

    /**
     * Collection for command group registration.
     */
    public groups: Collection<string, string[]>

    /**
     * Menu paths
     */
    private menuPaths: string[] = []

    /**
     *  Collection for SelectMenu's
     */
    private menus: Collection<string, SelectMenu>

    /**
     * Collection for aliases
     */
    public aliases: Collection<string, Command>

    /**
     * Creates instance for all collections.
     */
    private newCollections() {
        this.commands = new Collection<string, Command>()
        this.events = new Collection<string, Event>()
        this.cooldowns = new Collection<string, Collection<string, number>>()
        this.groups = new Collection<string, string[]>()
        this.menus = new Collection<string, SelectMenu>()
        this.aliases = new Collection<string, Command>()
        this.helpers = new Collection<string, Helper>()
    }

    constructor(client: DiscordClient) {
        this.client = client
        this.newCollections()
    }

    /**
     * Registers single event.
     * @param event Event object
     */
    private registerEvent(event: Event) {
        if (this.events.some(e => e.name === event.name)) throw new RegistryError(`A event with the name "${event.name}" is already registered.`)

        this.events.set(event.name, event)
        event.emitter
            ? event.emitter[event.type](event.name, (...params: any[]) => event.run(...params))
            : this.client[event.type](event.name as keyof ClientEvents, (...params: any) => event.run(...params))
        Logger.log('INFO', `Event "${event.name}" loaded.`)
    }

    /**
     * Registers a single helper
     * @param helper Helper object
     */
    private registerHelper(helper: Helper) {
        if (this.helpers.some(e => e.name === helper.name)) throw new RegistryError(`A helper with the name "${helper.name}" is already registered.`)

        this.helpers.set(helper.name, helper)
        helper.execute()
        Logger.log('INFO', `Helper "${helper.name}" loaded.`)
    }
    /**
     * Registers all helpers.
     */
    private registerAllHelpers() {
        const helpers: any[] = []
        requireAll({
            dirname: path.join(__dirname, '../helpers'),
            recursive: true,
            filter: /\w*.[tj]s/g,
            resolve: x => helpers.push(x),
            map: name => {
                return name
            }
        })

        for (let helper of helpers) {
            const valid = isConstructor(helper, Helper) || isConstructor(helper.default, Helper) || helper instanceof Helper || helper.default instanceof Helper
            if (!valid) continue

            if (isConstructor(helper, Helper)) helper = new helper(this.client)
            else if (isConstructor(helper.default, Helper)) helper = new helper.default(this.client)
            if (!(helper instanceof Helper)) throw new RegistryError(`Invalid event object to register: ${helper}`)

            this.registerHelper(helper)
        }
    }

    /**
     * Registers all events.
     */
    private registerAllEvents() {
        const events: any[] = []

        if (this.eventPaths.length)
            this.eventPaths.forEach(p => {
                delete require.cache[p]
            })

        requireAll({
            dirname: path.join(__dirname, '../events'),
            recursive: true,
            filter: /\w*.[tj]s/g,
            resolve: x => events.push(x),
            map: (name, filePath) => {
                if (filePath.endsWith('.ts') || filePath.endsWith('.js')) this.eventPaths.push(path.resolve(filePath))
                return name
            }
        })

        for (let event of events) {
            const valid = isConstructor(event, Event) || isConstructor(event.default, Event) || event instanceof Event || event.default instanceof Event
            if (!valid) continue

            if (isConstructor(event, Event)) event = new event(this.client)
            else if (isConstructor(event.default, Event)) event = new event.default(this.client)
            if (!(event instanceof Event)) throw new RegistryError(`Invalid event object to register: ${event}`)

            this.registerEvent(event)
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
     * Registers single menu.
     * @param menu menu object
     */
    private registerMenu(menu: SelectMenu) {
        if (this.menus.some(e => e.name === menu.name)) throw new RegistryError(`A event with the name "${menu.name}" is already registered.`)

        this.menus.set(menu.name, menu)
        Logger.log('INFO', `Menu "${menu.name}" loaded.`)
    }
    /**
     * Registers all SelectMenu's
     */
    private registerAllMenus() {
        const menus: any[] = []

        if (this.menuPaths.length)
            this.menuPaths.forEach(p => {
                delete require.cache[p]
            })

        requireAll({
            dirname: path.join(__dirname, '../interactions/SelectMenu'),
            recursive: true,
            filter: /\w*.[tj]s/g,
            resolve: x => menus.push(x),
            map: (name, filePath) => {
                if (filePath.endsWith('.ts') || filePath.endsWith('.js')) this.menuPaths.push(path.resolve(filePath))
                return name
            }
        })

        for (let menu of menus) {
            const valid = isConstructor(menu, SelectMenu) || isConstructor(menu.default, SelectMenu) || menu instanceof SelectMenu || menu.default instanceof SelectMenu
            if (!valid) continue

            if (isConstructor(menu, SelectMenu)) menu = new menu(this.client)
            else if (isConstructor(menu.default, SelectMenu)) menu = new menu.default(this.client)
            if (!(menu instanceof SelectMenu)) throw new RegistryError(`Invalid event object to register: ${menu}`)

            this.registerMenu(menu)
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
            dirname: path.join(__dirname, '../commands'),
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
        Logger.log('INFO', `Registered ${commands.length} commands.`)
    }

    /**
     * Finds and returns the command by name or alias.
     * @param command Name or alias
     */
    findCommand(command: string): Command | undefined {
        return this.commands.get(command) || [...this.commands.values()].find(cmd => cmd.info.aliases && cmd.info.aliases.includes(command))
    }

    /**
     * Finds and returns the menu by name or alias.
     * @param menu Name or alias
     */
    findMenu(menu: string): SelectMenu | undefined {
        return this.menus.get(menu)
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
        this.registerAllMenus()
        this.registerAllCommands()
        this.registerAllEvents()
        this.registerAllHelpers()
    }

    /**
     * Removes all events from client then reregisters events & commands. Resets groups and cooldowns.
     *
     * Call this function while client is offline.
     */
    reregisterAll() {
        const allEvents = [...this.events.keys()]
        allEvents.forEach(event => this.client.removeAllListeners(event))
        this.newCollections()

        this.registerAll()
    }
}
