import { resolve } from 'path'
import { createConnection } from 'typeorm'

import { DiscordClient } from '../structures/DiscordClient'

export class InitDatabase {
    static async Init(client: DiscordClient) {
        await createConnection({
            database: 'Data',
            entities: [__dirname + '/Entities/*.{ts,js}'],
            migrations: ['src/migration/**/*.ts'],
            cli: {
                entitiesDir: 'src/database/Entities',
                migrationsDir: 'src/migration'
            },
            type: 'mongodb',
            logging: true,
            synchronize: true,
            url: client.config.mongoUrl,
            useUnifiedTopology: true
        })
            .catch((e: Error) => {
                client.logger.log('ERROR', `caught database error: ${e.message}`)
                client.logger.log('ERROR', 'could not connect to database, exiting')
                return process.exit(1)
            })
            .then(connection => {
                for (const database of Object.values(client.databases)) {
                    database._init()
                }
                client.logger.log('SUCCESS', `initialized ${Object.values(client.databases).length} databases`)
            })
    }
}
