const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const uplinkSchema = new mongoose.Schema({
    deviceid: {
        type: String,
        required: true
    },
    payloadHex: {
        type: String,
        required: true
    },
    ValueDecodeInstant: {
        type: String,
        required: true
    },
    ValueDecodeTote: {
        type: String,
        required: true
    },
    Entity: {
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
    AnalogSignal: {
        type: String,
        required: true
    },
    RangeAnalogSignal: {
        type: String,
        required: true
    },
    DigitalSignal: {
        type: String,
        required: true
    },
    ProcessVariable: {
        type: String,
        required: true
    },
    RangeProcessVariable: {
        type: String,
        required: true
    },
    created_at: {
        type: Number, 
        required: true, 
        default: Date.now 
    }
})

module.exports = mongoose.model('uplink',uplinkSchema)