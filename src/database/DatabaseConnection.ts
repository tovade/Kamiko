import { connect, connection } from 'mongoose';

import { DiscordClient } from '../lib/structures/DiscordClient';

export async function database(client: DiscordClient) {
    const uri = client.config.mongoUrl

    try {
        await connect(uri, {
            keepAlive: true
        })

        connection.on('connected', () => {
            client.logger.log('SUCCESS', 'Connected to mongoDB!')
        })
    } catch (e: any) {
        client.logger.log('ERROR', e?.message!)
    }
}
