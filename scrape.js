// Scrape saal website data using custome helper functions and write to csv files per meeting

const rp = require('request-promise');
const cheerio = require('cheerio');

// Import custom helper functions
const saal = require('./saalWebsiteData.js');

// Initialize cvs writer
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Get race meetings
async function meetings() {
    const meetings = await saal.getMeetings();
    return meetings;
}

// Get races for each meeting
async function meetingRaces() {
    const meets = await meetings();
    const allMeetingRaces = [];
    for (let i = 0, len = meets.length; i < 2; i++) {
        const races = {};
        races["meeting"] = meets[i].name;
        races["date"] = meets[i].date;
        races["races"] = await saal.getMeetingRaces(meets[i].link);
        allMeetingRaces.push(races);
    }

    console.log(allMeetingRaces);
    return allMeetingRaces
}

// Get race results for each race
async function raceResultsToCsvFiles() {
    const data = await meetingRaces();
    for (let i = 0, len = data.length; i < len; i++) {
        // Initialize new csv file
        const csvWriter = createCsvWriter({
            path: `meeting${i}.csv`,
            header: [
                {id: 'position', title: 'POSITION'},
                {id: 'name', title: 'NAME'},
                {id: 'color', title: 'COLOR'},
                {id: 'mark', title: 'MARK'},
                {id: 'time', title: 'TIME'}
            ]
        });
        for (let j = 0, len = data[i].races.length; j < len; j++) {
            const raceData = await saal.getRaceResults(data[i].races[j].link);
            console.log("==================== ", raceData);
            // Write race results for current race to csv file
            csvWriter.writeRecords(raceData)
            .then(() => {
                console.log('...Done');
            });
        }
    }
}

// raceResultsToCsvFiles();



// Write records to csv file
// csvWriter.writeRecords(records)      // returns a promise
//   .then(() => {
//     console.log(records);
//       console.log('...Done');
//   });
