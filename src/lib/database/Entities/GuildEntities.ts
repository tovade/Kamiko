import { Snowflake } from 'discord.js';
import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'guilds' })
export class GuildSetting {
    @ObjectIdColumn()
    public _id!: ObjectID

    @PrimaryColumn('string')
    public id!: Snowflake

    @Column('string')
    public prefix = 'k.'

    @Column('string')
    public language = 'en_US'
}
