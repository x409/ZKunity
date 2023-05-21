const fs = require('fs');
const assert = require('assert');
const { generateSolarData, appendData } = require('./src/solar.js');

const dataFile = './solarData.json';

describe('Solar Data Generation', () => {
  before((done) => {
    // Clear existing data before running the tests
    fs.writeFile(dataFile, '[]', (err) => {
      if (err) {
        console.error(err);
        done(err);
      } else {
        done();
      }
    });
  });

  after((done) => {
    // Clear generated data after running the tests
    fs.writeFile(dataFile, '[]', (err) => {
      if (err) {
        console.error(err);
        done(err);
      } else {
        done();
      }
    });
  });

  it('should append new solar data with entries for each hour', (done) => {
    // Generate new solar data
    const newData = generateSolarData();

    // Append the new data
    appendData(newData);

    // Read the data file and check if the new data is appended correctly
    fs.readFile(dataFile, 'utf8', (err, fileContents) => {
      if (err) {
        console.error(err);
        done(err);
      } else {
        const existingData = JSON.parse(fileContents);

        // Check if the new data is appended with correct values
        assert.equal(existingData.length, 1);
        assert.equal(existingData[0].dayOfYear, newData.dayOfYear);
        assert.equal(existingData[0].numPanels, newData.numPanels);
        assert.deepStrictEqual(existingData[0].data, newData.data);

        done();
      }
    });
  });
});

