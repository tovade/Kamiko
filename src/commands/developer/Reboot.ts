import { Message } from 'discord.js';

import Logger from '../../classes/Logger';
import Command from '../../structures/Command';
import DiscordClient from '../../structures/DiscordClient';
import { IContext } from '../../utils/interfaces';

export default class RebootCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'reboot',
            group: 'Developer',
            description: 'Reboots the bot.',
            require: {
                developer: true
            }
        });
    }

    async run(ctx: IContext) {
        const { message } = ctx;
        Logger.log('WARNING', `Bot rebooting... (Requested by ${message.author.tag})`, true);

        this.client.destroy();

        this.client.registry.reregisterAll();

        this.client.login(this.client.config.token).then(async () => {
            this.client.emit('ready');

            await message.channel.send({
                embeds: [
                    {
                        color: 'GREEN',
                        description: `${message.author}, bot rebooted successfully.`,
                        footer: {
                            text: '© Kamiko'
                        }
                    }
                ]
            });
        });
    }
}
