import { IContext } from '../../utils/interfaces';
import Command from '../../structures/Command';
import DiscordClient from '../../structures/DiscordClient';

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'ping',
            group: 'General',
            description: 'Ping command.',
            cooldown: 5
        });
    }

    async run(ctx: IContext) {
        await ctx.message.reply(`My ping is \`${this.client.ws.ping}ms\``);
    }
}
