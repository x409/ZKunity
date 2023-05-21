function generateSolarData(minutes) {
    let data = [];
    let currentDate = new Date();

    for(let i = 0; i < minutes * 2; i++) {
        let currentHour = new Date(currentDate.getTime() + i*30*1000).getHours();
        let solarOutput;

        if (currentHour >= 0 && currentHour < 6) {
            solarOutput = 0;
        } else if (currentHour >= 6 && currentHour < 14) {
            solarOutput = Math.floor(((currentHour - 6) + Math.random()) / 8 * 240);
        } else if (currentHour >= 14 && currentHour < 20) {
            solarOutput = Math.floor((1 - (currentHour - 14 + Math.random()) / 6) * 230);
        } else {
            solarOutput = 0;
        }

        let timestamp = new Date(currentDate.getTime() + i*30*1000).toISOString();

        data.push({
            timestamp: timestamp,
            solarOutput: solarOutput
        });
    }

    return data;
}

console.log(generateSolarData(10));
