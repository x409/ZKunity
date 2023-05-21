const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dataDirectory = './data';
const dataFile = path.join(dataDirectory, 'solarData.json');

let crypto = require('./crypto.js');
let random = crypto.generateRandomString;
let hash = require('./crypto.js');
let generateHash = hash.generateHash;


// Number of solar panels
const numPanels = 2;

// Define solar panels
let panels = Array.from({ length: numPanels }, () => ({
  uuid: uuidv4(),
  output: {
    hourOfTheDay: null,
    entries: []
  }
}));

function formatDate(date) {
  let day = String(date.getDate()).padStart(2, '0');
  let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero based
  let year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function generateSolarData() {
  let currentDate = new Date();
  let currentDay = formatDate(currentDate);
  let currentHour = currentDate.getHours();

  let entries = [];

  for (let panel of panels) {
    let solarOutput;

    if (currentHour >= 0 && currentHour < 6) {
      solarOutput = 0;
    } else if (currentHour >= 6 && currentHour < 14) {
      solarOutput = ((currentHour - 6) + Math.random()) / 8 * 240 / 120;
    } else if (currentHour >= 14 && currentHour < 20) {
      solarOutput = (1 - (currentHour - 14 + Math.random()) / 6) * 240 / 120;
    } else {
      solarOutput = 0;
    }

    let timestamp = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

    panel.output.hourOfTheDay = currentHour;
    panel.output.entries.push({
      solarOutput: solarOutput,
      timestamp: timestamp
    });

    entries.push({
      uuid: panel.uuid,
      output: {
        hourOfTheDay: currentHour,
        entries: panel.output.entries
      }
    });
  }

  let data = {
    dayOfYear: currentDay,
    numPanels: numPanels,
    data: entries
  };

  return data;
}


// Function to append data to existing data
function appendData(newData) {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory);
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, '[]');
  }

  fs.readFile(dataFile, 'utf8', (err, fileContents) => {
    if (err) {
      console.error(err);
      return;
    }

    let existingData = JSON.parse(fileContents);
    let day = newData.dayOfYear;
    let existingDayData = existingData.find(dayData => dayData.dayOfYear === day);

    if (!existingDayData) {
      existingData.push(newData);
    } else {
      for (let panel of newData.data) {
        let existingPanel = existingDayData.data.find(p => p.uuid === panel.uuid);

        if (existingPanel) {
          existingPanel.output.entries = panel.output.entries;
        }
      }
    }

    fs.writeFile(dataFile, JSON.stringify(existingData, null, 2), (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log("Data has been appended to solarData.json successfully.");
    });
  });
}

setInterval(() => {
  let newData = generateSolarData();
  appendData(newData);
}, 30000);
