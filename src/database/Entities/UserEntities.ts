import { Snowflake } from 'discord.js'
import { Entity, Column, ObjectID, ObjectIdColumn, PrimaryColumn } from 'typeorm'
@Entity({ name: 'users' })
export class UserSetting {
    @ObjectIdColumn()
    public _id!: ObjectID

    @PrimaryColumn('string')
    public id!: Snowflake

    @Column('object')
    public reminder: any = {
        hasReminder: false,
        reminders: []
    }
}
