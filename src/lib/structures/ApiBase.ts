import { createOptionHandler } from '../../utils/functions';

export class APIWrapper {
    public name: string
    public envVars: string[]
    constructor(opts: any) {
        const options = createOptionHandler('APIWrapper', opts)

        this.name = options.required('name')
        this.envVars = options.optional('envVars', [])
    }

    /**
     * Check if the API can load
     * @returns {boolean} - Whether the API can load
     */
    canLoad() {
        return true
    }

    /**
     * Loads the API
     * @returns {APIWrapper} - The loaded API
     */
    load() {
        return this
    }
}
