var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const mongodb = require('mongodb');
var model_trades = require('../models/model_Trades');

var model_RSI = require('../models/model_RSI');


const binance = require('node-binance-api')().options({
    APIKEY: 'ZtsAUYrtfQOFEa1ZkIGXLz1EhamhInHvdAv1d3KTB0eeoiDwUVv6ZB58fC3Gd0G2',
    APISECRET: '4m0kK0n9x9FGkq5u3skaAD46FctV5mUFTuTQbVxKygAt64chCKHRf33jPVIpTQSS',
    useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
    test: true // If you want to use sandbox mode where orders are simulated
});

router.get('/trades', function (req, res, next) {
    // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
    binance.candlesticks("BNBBTC", "1d", (error, ticks, symbol) => {
        //console.log("candlesticks()", ticks);
        let last_tick = ticks[ticks.length - 1];
        let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
        //console.log(symbol + " last close: " + close);
        //res.send(ticks);


        for (var i = 0; i < ticks.length; i++) {
            let model = new model_Trade();
            let arraysplit = ticks[i].toString().split(",");
            model.time = arraysplit[0];
            model.open = arraysplit[1];
            model.high = arraysplit[2];
            model.low = arraysplit[3];
            model.close = arraysplit[4];
            model.volume = arraysplit[5];
            model.closeTime = arraysplit[6];
            model.assetVolume = arraysplit[7];
            model.trades = arraysplit[8];
            model.buyBaseVolume = arraysplit[9];
            model.buyAssetVolume = arraysplit[10];
            model.ignored = arraysplit[11];
            // console.log(model.time);
            // console.log(model.open);
            model.save((err) => {
                if (err) {
                    console.log('errro save data');
                    return;
                }
                else {
                    res.status(200).send('successful');
                }
            });
        }

    }, { limit: 500, endTime: 1514764800000 });
});

router.get('/queryTimeClose', function (req, res, next) {
    var timeData;
    var closeData;
    var arrayClose = [];
    var arrayTime = [];

    model_trades.find({}, function (err, data) {
        if (err) throw err;
        else {
            console.log('querry time and close successful');
            //console.log(closeData);
            //res.status(200).send(closeData);
            //convert close to array
        }
        for (var i = 0; i < data.length; i++) {
            arrayClose.push(data[i].close);
        };
        for (var i = 0; i < data.length; i++) {
            arrayTime.push(data[i].time);
        };
        ///console.log(arrayClose);
        //console.log(arrayTime);
        //console.log(arrayClose);
        // for (var i = 0; i < 29; ++i) {
        //     var model = new model_RSI();
        //     var arrChange = [];
        //     var arrGain = [];
        //     var arrLoss = [];
        //     var arrAvgGain = [];
        //     var arrAvgLoss = [];
        //     var arrRS = [];
        //     if (i == 0) {
        //         model.Date = data[0].time;
        //         model.CLose = arrayClose[0];
        //         model.Change = 0;
        //         model.Gain = 0;
        //         model.Loss = 0;
        //         model.AvgGain = 0;
        //         model.AvgLoss = 0;
        //         model.RS = 0;
        //         model._14DayRSI = 0;
        //         arrChange[0] = arrGain[0] = arrLoss[0] = arrAvgGain[0] = arrAvgLoss[0] = arrRS[0] = 0;
        //     }
        //     else {
        //         var sumGain = 0;
        //         var sumLoss = 0;

        //         model.Date = data[i].time;
        //         model.CLose = arrayClose[i];
        //         model.Change = arrayClose[i] - arrayClose[i - 1];
        //         //push vao mang change
        //         arrChange.push(model.Change);

        //         if (arrChange[i] > 0) {
        //             arrGain.push(arrChange[i]);
        //             model.Gain = arrChange[i];
        //         }
        //         else {
        //             arrGain.push(0);
        //             model.Gain = 0;
        //         };

        //         model.Loss = arrChange[i] < 0 ? arrChange[i] : 0;
        //         if (arrChange[i] < 0) {
        //             arrLose.push(arrChange[i]);
        //             model.Loss = arrChange[i];
        //         }
        //         else {
        //             arrLoss.push(0);
        //             model.Loss = 0;
        //         }

        //         sumGain += arrGain[i];
        //         sumLoss += arrLoss[i];

        //         if (i < 14) {
        //             model.AvgGain = 0;
        //             model.AvgLoss = 0;
        //             model.RS = 0;
        //             model._14DayRSI = 0;
        //             arrAvgGain.push(0);
        //             arrAvgLoss.push(0);
        //             arrChange.push(0);
        //             arrRS.push(0);

        //         }
        //         else if (i == 14) {
        //             arrAvgGain.push(sumGain / 14);
        //             model.AvgGain =sumGain / 14;
        //             arrAvgLoss.push(sumLoss / 14);
        //             model.AvgLoss = sumLoss / 14;

        //             arrRS.push(arrAvgGain[i] / arrAvgLoss[i]);
        //             model.RS = arrAvgGain[i] / arrAvgLoss[i];

        //             if (arrAvgLoss[i] == 0) {
        //                 model._14DayRSI = 100;
        //             }
        //             else {
        //                 model._14DayRSI = (100 - (100 / (1 + arrRS[i])));
        //             };
        //         }
        //         else {
        //             arrAvgGain.push( (arrAvgGain[i] * 13 + arrGain[i]) / 14);
        //             model.AvgGain =(arrAvgGain[i] * 13 + arrGain[i]) / 14;
        //             arrAvgLoss.push(arrAvgLoss[i] * 13 + arrLoss[i] / 14);
        //             model.AvgLoss = (arrAvgLoss[i] * 13 + arrLoss[i])/ 14;

        //             arrRS.push(arrAvgGain[i] / arrAvgLoss[i]);
        //             model.RS = arrAvgGain[i] / arrAvgLoss[i];

        //             if (arrAvgLoss[i] == 0) {
        //                 model._14DayRSI = 100;
        //             }
        //             else {
        //                 model._14DayRSI = (100 - (100 / (1 + arrRS[i])));
        //             };
        //         };


        //     }
        for (var i = 0; i < data.length; i++) {
            var model = new model_RSI();
            var sumGain = 0;
            var sumLoss = 0;
            if (i == 0) {
                model.Date = data[0].time;
                model.CLose = arrayClose[0];
                model.Change = 0;
                model.Gain = 0;
                model.Loss = 0;
                model.AvgGain = 0;
                model.AvgLoss = 0;
                model.RS = 0;
                model._14DayRSI = 0;
            }
            else {
                model.Date = data[i].time;
                model.CLose = arrayClose[i];
                model.Change = arrayClose[i] - arrayClose[i - 1];
                if (model.Change > 0) {
                    model.Gain = model.Change;
                }
                else {
                    model.Gain = 0;
                }
                if (model.Change < 0) {
                    model.Loss = -model.Change;
                }
                else {
                    model.Loss = 0;
                }
                sumGain += model.Gain;
                sumLoss += model.Loss;
                var avgG;
                var avgL;
                if (i < 14) {
                    model.AvgGain = 0;
                    model.AvgLoss = 0;
                    model.RS = 0;
                    model._14DayRSI = 0;
                }
                else if (i == 14) {
                    model.AvgGain = sumGain / 14;
                    model.AvgLoss = sumLoss / 14;
                    avgG = model.AvgGain;
                    avgL = model.AvgLoss;
                    model.RS =(model.Gain / model.Loss);

                    if (model.AvgLoss == 0) {
                        model._14DayRSI = 100;
                    }
                    else {
                        model._14DayRSI = (100 - (100 / (1 + model.RS)));
                    }
                }
                else {
                    model.AvgGain = (avgG * 13 + model.Gain) / 14;
                    model.AvgLoss = (avgL * 13 + model.Loss) / 14;
                    model.RS =(model.Gain / model.Loss);

                    if (model.AvgLoss == 0) {
                        model._14DayRSI = 100;
                    }
                    else {
                        model._14DayRSI = (100 - (100 / (1 + model.RS)));
                    }
                }


                console.log('Date: ' + model.Date);
                console.log('CLose: ' + model.CLose);
                console.log('Change: ' + model.Change);
                console.log('Gain: ' + model.Gain);
                console.log('AvgGain: ' + model.AvgGain);
                console.log('AvgLoss: ' + model.AvgLoss);
                console.log('RS: ' + model.RS);
                console.log("_14DayRSi: " + model._14DayRSI);
                console.log("--------------------" + i);
            }
             // model.save((err) => {
        //     if (err) {
        //         console.log('erro' + err);
        //         return;
        //     }
        //     console.log('successful');
        //     // });
        }
    }).select('time close');
});

module.exports = router;