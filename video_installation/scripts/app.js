/*jslint browser: true, maxlen: 80 */

/*global define, window */

define(['scan-image', 'vertical-graph'], function (scanImage, verticalGraph) {
    'use strict';

    var client = new window.WebSocket('ws://localhost:8080/');

    client.onerror = function () {
        window.console.log('Connection error');
    };

    client.onopen = function () {
        window.console.log('Client connected');
    };

    client.onclose = function () {
        window.console.log('Client closed');
    };

    client.onmessage = function (e) {
        var data;
        if (typeof e.data === 'string') {
            data = JSON.parse(e.data);
        } else {
            return;
        }

        switch (data.type) {
        case 'sideLen':
            scanImage.sideLen = data.sideLen;
            break;
        case 'pixels':
            scanImage.drawPixels(data.pixels);
            break;
        case 'realPositions':
            verticalGraph.appendPositions(data.positions);
            break;
        }
    };
});