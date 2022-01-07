import { Snowflake } from 'discord.js';
import { Document, model, models, ObjectId, Schema } from 'mongoose';

export interface WarnData extends Document {
    _id: ObjectId
    guildID: Snowflake
    content: string[]
}

const ISchema = new Schema({
    id: String,
    guildID: String,
    content: { type: Array, default: [] }
})

export default model('warnings', ISchema)
