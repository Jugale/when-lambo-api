'use strict';

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const request = require('request');
const md5 = require('md5');

function handleAPI(req, res) {

    var coinCode = req.query.coin;
    var amount = req.query.amount;
    var ETag = req.header("If-None-Match");

    if (!coinCode) {
        res.status(400);
        respondWithError("missing parameter 'coin'", res);
        return;
    }

    if (!amount) {
        res.status(400);
        respondWithError("missing parameter 'amount'", res);
        return;
    } else {
        amount = parseFloat(amount);
    }

    var COINCODE = coinCode.toUpperCase();
    var crunchFunction = crunch;
    var errorFunction = respondWithError;

    console.log(`Data: coin=${COINCODE}, amount=${amount}`);

    request({
        url: `https://min-api.cryptocompare.com/data/price?fsym=${COINCODE}&tsyms=USD`,
        json: true
      }, function (error, response, body) {

        if (body.Response == "Error") {
            res.status(400);
            console.log(`Coin Error: ${body}`);
            errorFunction(`unable to retrieve price of ${COINCODE}`, res);
            return;
        }

        var USD_price = body.USD;
        console.log(`Coin price: ${USD_price}`);

        crunchFunction(USD_price, amount, ETag, COINCODE, res);
    });
}

function crunch(USD, amount, ETag, coin, res) {

    var savings = USD * amount;
    console.log(`Savings: ${savings}`);

    // From http://www.wolframalpha.com/input/?i=lamborghini+cost+2018&assumption=%7B%22C%22,+%22lamborghini%22%7D+-%3E+%7B%22AutomobileManufacturer%22%7D&assumption=%7B%22DPClash%22,+%22AutomobileManufacturerP%22,+%22cost%22%7D+-%3E+%7B%22MSRPPrice%22%7D on 2018-07-03
    var lamboPrice = 296100.0;

    var responseString = "unknown";

    // Business Logic
    if (savings < lamboPrice) {
        responseString = "not yet";
    } else {
        responseString = "now";
    }

    // Entity tagging, just for the lols
    var calculatedTag = md5(`${coin}-${amount}-${responseString}`);

    if (ETag) {
        if (calculatedTag == ETag) {
            // The response hasn't changed
            // 304 Not Modified
            res.status(304);
            res.set('ETag', '');
            res.send('');
            return;
        }
    }

    res.status(200);
    res.set('ETag', calculatedTag);
    respondWith(responseString, res);
}

function respondWithError(message, res) {
    var obj = { "error": message };
    var jsonString = JSON.stringify(obj);

    res.set('Content-Type', 'application/problem+json');
    res.send(jsonString);
}

function respondWith(when_lambo, res) {
    var obj = { "when_lambo": when_lambo };
    var jsonString = JSON.stringify(obj);

    res.set('Content-Type', 'application/json');
    res.send(jsonString);
}

app.get('/api/', handleAPI);

app.listen(PORT, () => console.log('Example app listening on port: ' + PORT));
