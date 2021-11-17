import Collection from '@discordjs/collection'
import { Snowflake } from 'discord-api-types'
import { getMongoRepository, MongoRepository } from 'typeorm'
import { UserSetting } from '../Entities/UserEntities'

export class UserDatabaseManager {
    public repository!: MongoRepository<UserSetting>

    public _init() {
        this.repository = getMongoRepository(UserSetting)
    }

    public async get(id: Snowflake): Promise<UserSetting> {
        const data = await this.repository.findOne({ id })
        if (!data) {
            const createdData = this.repository.create({ id })
            await this.repository.save(createdData)
            return createdData
        }
        return data
    }

    public async set(id: Snowflake, key: keyof UserSetting, value: any): Promise<UserSetting> {
        const data = await this.get(id)
        // @ts-ignore
        data[key] = value
        await this.repository.save(data)
        return data
    }
    public async delete(id: Snowflake) {
        await this.repository.deleteOne({ id })
    }
}
