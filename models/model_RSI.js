const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RSISchema = new Schema({
    Date: Number,
    Close: Number,
    Change: Number,
    Gain: Number,
    Loss: Number,
    AvgGain: Number,
    AvgLoss: Number,
    RS: Number,
    _14DayRSI: Number
});

module.exports = mongoose.model('model_RSI',RSISchema);