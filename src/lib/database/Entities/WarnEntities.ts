import { Snowflake } from 'discord.js';
import {
    Column, Entity, getMongoRepository, ObjectID, ObjectIdColumn, PrimaryColumn
} from 'typeorm';

@Entity({ name: 'warnings' })
export class Warnings {
    @ObjectIdColumn()
    public _id!: ObjectID

    @PrimaryColumn('string')
    public id!: Snowflake

    @Column('string')
    public guildID!: Snowflake

    @Column('array')
    public content: string[]
}
