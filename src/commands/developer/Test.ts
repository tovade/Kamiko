import Command from '../../lib/structures/Command';
import { DiscordClient } from '../../lib/structures/DiscordClient';
import { IContext } from '../../utils/interfaces';

export default class TestCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'test',
            group: 'Developer',
            description: 'Test command for developers',
            examples: ['!test @Administrators HELLO'],
            context: {
                developer: true
            }
        })
    }
    //As an example on how to cancel cooldowns
    async run(ctx: IContext) {
        await ctx.message.reply(`the prefix here is your mom`)
    }
}
