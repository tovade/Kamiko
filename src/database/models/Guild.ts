import { Snowflake } from 'discord.js';
import { Document, model, models, ObjectId, Schema } from 'mongoose';

export interface GuildData extends Document {
    _id: ObjectId
    id: Snowflake
    prefix: string
}

const ISchema = new Schema({
    id: String,
    prefix: { type: String, default: 'k.' }
})

export default model('guilds', ISchema)
