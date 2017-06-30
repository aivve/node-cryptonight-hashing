"use strict";
let multiHashing = require('../build/Release/multihashing');
let fs = require('fs');
let lineReader = require('readline');

let hashes = {
    'CryptoNight': {
        'file': 'cryptonight.txt',
        'fileFormat': 'cn',
        'function': multiHashing.cryptonight
    },
    'CryptoNightLight': {
        'file': 'cryptonight_light.txt',
        'fileFormat': 'cn',
        'function': multiHashing.cryptonight_light
    }
};

hashes.forEach(function(hashType){
    let testsFailed = 0, testsPassed = 0;
    lineReader.createInterface({
        input: fs.createReadStream(hashes[hashType].file)
    });
    lineReader.on('line', function (line) {
        if (hashes[hashType].format === 'cn'){
            let line_data = line.split(' ');
            if (line_data[0] !== hashes[hashType].function(Buffer.from(line_data[1])).toString('hex')){
                testsFailed += 1;
            } else {
                testsPassed += 1;
            }
        }
    });
    lineReader.on('close', function(){
        if (testsFailed > 0){
            console.log(testsFailed + '/' + (testsPassed + testsFailed) + ' tests failed on: ' + hashType);
        } else {
            console.log(testsPassed + ' tests passed on: ' +hashType);
        }
    });
});