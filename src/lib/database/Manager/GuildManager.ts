import Collection from '@discordjs/collection'
import { Snowflake } from 'discord-api-types'
import { getMongoRepository, MongoRepository } from 'typeorm'
import { GuildSetting } from '../Entities/GuildEntities'

export class GuildDatabaseManager {
    public repository!: MongoRepository<GuildSetting>
    public cache: Collection<Snowflake, GuildSetting> = new Collection()

    public _init() {
        this.repository = getMongoRepository(GuildSetting)
    }

    public async get(id: Snowflake): Promise<GuildSetting> {
        const cache = await this.cache.get(id)
        if (cache) return cache
        const data = await this.repository.findOne({ id })
        if (!data) {
            const createdData = this.repository.create({ id })
            if (this.repository) await this.cache.set(id, createdData)
            await this.repository.save(createdData)
            return createdData
        }
        if (this.repository) await this.cache.set(id, data)
        return data
    }

    public async set(id: Snowflake, key: keyof GuildSetting, value: any): Promise<GuildSetting> {
        const data = (await this.repository.findOne({ id })) ?? this.repository.create({ id })
        // @ts-ignore
        data[key] = value
        await this.repository.save(data)
        await this.cache.set(id, data)
        return data
    }
    public async delete(id: Snowflake) {
        await this.repository.deleteOne({ id })
        return this.cache.delete(id)
    }
}
