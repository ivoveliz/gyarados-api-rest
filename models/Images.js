const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const ImagesSchema = new mongoose.Schema({
    IdAsociate: {
        type: String,
        required: true
    },
    image: {
        base64: String,
        imageFormat: String
        },
    created_at: {
        type: Number, 
        required: true, 
        default: Date.now 
    }
})

module.exports = mongoose.model('Images',ImagesSchema)
 