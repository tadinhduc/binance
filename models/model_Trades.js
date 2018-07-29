const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tradeSchema = new Schema({
    time: Number,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
    closeTime: Number,
    assetVolume: Number,
    trades: Number,
    buyBaseVolume: Number,
    buyAssetVolume: Number,
    ignored: Number
});


module.exports = mongoose.model('model_trades', tradeSchema);