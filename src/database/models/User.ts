import { Snowflake } from 'discord.js';
import { Document, model, models, ObjectId, Schema } from 'mongoose';

export interface Userdata extends Document {
    _id: ObjectId
    id: Snowflake
    reminder: any
}

const ISchema = new Schema({
    id: String,
    reminder: {
        type: Object,
        default: {
            hasReminder: false,
            reminders: []
        }
    }
})

export default model('users', ISchema)
