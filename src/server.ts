import { createServer } from 'http';
import next from 'next';
import { parse } from 'url';

import config from './config/config';
import { DiscordClient } from './lib/structures/DiscordClient';

export default (client: DiscordClient) => {
    const dev = config.devmode === 'true'
    const app = next({ dev })
    const handle = app.getRequestHandler()

    app.prepare()
        .then(() => {
            return createServer((req, res) => {
                const parsedUrl = parse(req.url!, true)

                ;(req as any).client = client

                handle(req, res, parsedUrl)
            }).listen(config.port, () => {
                client.logger.log('dashboard', 'Dashboard was started')
            })
        })
        .catch(console.error)
}
