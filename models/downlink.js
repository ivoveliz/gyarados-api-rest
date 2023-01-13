const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const downlinkSchema = new mongoose.Schema({
    deviceid: {
        type: String,
        required: true
    },
    payloadHex: {
        type: String,
        required: true
    },
    State: {
        type: String,
        required: true
    },
    VertionFirmware: {
        type: String,
        required: true
    },

    created_at: {
        type: Number, 
        required: true, 
        default: Date.now 
    }
})

module.exports = mongoose.model('downlink',downlinkSchema)