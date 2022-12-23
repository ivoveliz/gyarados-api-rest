const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const organizationSchema = new mongoose.Schema({
    NamePrimaryGroup: {
        type: String,
        required: true
    },
    IdGroup: {
        type: String,
        required: true
    },
    SecondaryGroups: {
        type: Object,
        required: true
    },
    created_at: {
        type: Number, 
        required: true, 
        default: Date.now 
    }
})

module.exports = mongoose.model('organization',organizationSchema)