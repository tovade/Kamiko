import axios from 'axios'

import { APIWrapper } from '../structures/ApiBase'

const API_URL = 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery'

export default class VSCodeExtensions extends APIWrapper {
    constructor() {
        super({
            name: 'vscode'
        })
    }

    async search(name: string) {
        return axios({
            data: {
                filters: [
                    {
                        criteria: [
                            {
                                filterType: 10,
                                value: name
                            }
                        ]
                    }
                ],
                flags: 0x2 | 0x4 | 0x100
            },
            headers: {
                accept: 'application/json; api-version=3.0-preview',
                'accept-encoding': 'gzip',
                'content-type': 'application/json; api-version=3.0-preview.1'
            },
            url: API_URL,
            method: 'POST'
        })
    }
}
