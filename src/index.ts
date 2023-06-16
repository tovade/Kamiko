// Getting and validating .env file
import EnvLoader from './lib/utils/EnvLoader'
EnvLoader.load()

// Setting up moment-timezone
import moment from 'moment-timezone'
moment.locale('en')
moment.tz.setDefault('Europe/Istanbul')

// Starting client
import { KamikoClient } from './lib/KamikoClient'

const client = new KamikoClient({
    auth: `Bot ${process.env.TOKEN}`,
    gateway: {
        intents: [
            'GUILDS',
            'GUILD_MESSAGES',
            'GUILD_MESSAGE_REACTIONS',
            'GUILD_MEMBERS',
            'GUILD_PRESENCES',
            'MESSAGE_CONTENT',
            'AUTO_MODERATION_CONFIGURATION',
            'AUTO_MODERATION_EXECUTION'
        ]
    }
})
client.connect()
