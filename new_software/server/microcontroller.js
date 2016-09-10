// Interfaces with the microcontroller, for measuring and controlling the
// hardware.

/*jslint node: true, es6: true, maxlen: 80 */

"use strict";

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var port;

function listSerialPorts(callback) {
    serialport.list(function (ignore, ports) {
        callback(ports);
    });
}

function connect(settings) {
    port = new SerialPort(settings.comName, {
        baudRate: 115200,
        parser: serialport.parsers.readline("\n")
    });
    port.on("open", function () {
        console.log("Serial port opened");
        settings.onConnected();
    });
    port.on("close", function () {
        console.log("Serial port closed");
    });
    port.on("error", function () {
        console.log("Serial port error");
    });
    port.on("disconnected", function () {
        console.log("Serial port disconnected");
    });
    port.on("data", function (json) {
        var data;
        try {
            data = JSON.parse(json);
        } catch (e) {
            if (e.name === "SyntaxError") {
                console.log("Data is not valid JSON: " + json);
                return;
            }
        }
        settings.onData(data);
    });
}

function sendJson(modeChainJson) {
    port.write(modeChainJson);
}

module.exports = {
    listSerialPorts: listSerialPorts,
    connect: connect,
    sendJson: sendJson
};