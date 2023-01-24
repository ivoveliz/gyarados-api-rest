const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    LevelAccess: {
        type: String,
        required: true
    },
    ability: {
        type: Object,
        required: true
    },
    created_at: {
        type: Number, 
        required: true, 
        default: Date.now 
    }
})

module.exports = mongoose.model('user',userSchema)