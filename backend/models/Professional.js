const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    specialty: {
        type: String,
        required: true
    },
    availableDates: [Date],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Professional', professionalSchema);
