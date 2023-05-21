const fs = require('fs');
const crypto = require('crypto');

function generateRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var result = '';
    var bytesNeeded = Math.ceil(length * 3 / 4); // Number of bytes needed to generate the requested length

    while (result.length < length) {
        var randomBytes = crypto.randomBytes(bytesNeeded);
        for (var i = 0; i < randomBytes.length && result.length < length; i++) {
            var randomByte = randomBytes[i];
            if (randomByte < 256 - (256 % randomChars.length)) {
                result += randomChars.charAt(randomByte % randomChars.length);
            }
        }
    }

    return result;
}

function generateHash(data) {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(data));
    return hash.digest('hex');
}

function generateNewStructure(data) {
    return data.map(entry => {
        const newEntry = { ...entry }; // create a copy
        newEntry.data = newEntry.data.map(datum => {
            const newDatum = { ...datum }; // create a copy
            let i, j;
            const entries = [];
            for (i = 0, j = newDatum.output.entries.length; i < j; i += 10) {
                const tempArray = newDatum.output.entries.slice(i, i + 10);
                entries.push({
                    "solarEntries": tempArray,
                    "hash": generateHash(tempArray),
                    "zkSn": generateRandomString(80) // or any other length
                });
            }
            newDatum.output.entries = entries;
            return newDatum;
        });
        return newEntry;
    });
}

fs.readFile('solarData.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }
    const data = JSON.parse(jsonString);
    const newData = generateNewStructure(data);
    fs.writeFile('verified.json', JSON.stringify(newData, null, 2), err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    });
});
