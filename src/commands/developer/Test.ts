import { Message, Role } from 'discord.js';

import Command from '../../structures/Command';
import DiscordClient from '../../structures/DiscordClient';
import { IContext } from '../../utils/interfaces';

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'test',
            group: 'Developer',
            description: 'Test command for developers',
            examples: ['!test @Administrators HELLO'],
            require: {
                developer: true,
                role: true,
                args: 1
            }
        });
    }
    //As an example on how to cancel cooldowns
    async run(ctx: IContext, cancelCooldown: () => void) {
        await ctx.message.reply(`${ctx.mentions.role?.name}, ${ctx.args[0]}`);
    }
}
