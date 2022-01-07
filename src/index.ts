// Getting and validating .env file
import EnvLoader from './classes/EnvLoader'
EnvLoader.load()

// Setting up moment-timezone
import moment from 'moment-timezone'
moment.locale('en')
moment.tz.setDefault('Europe/Istanbul')
import { database } from './database/DatabaseConnection'
// Starting client
import client from './client'
database(client)
client.login(client.config.token)

process.on('exit', () => {
    client.destroy()
})
// all the code below is from next server configuration all credits to CasperTheGhost#4546
import config from './config/config'

if (config.dash_enabled === 'true') {
    import('./server').then(v => v.default(client))
}
