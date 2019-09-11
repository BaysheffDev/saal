/*
* Scrape saal website and load data into postgress database
*/

// Require database connection
const db = require('./db.js').dbConnection;
// Import custom webscraping functions
const saal = require('./saalWebsiteData.js');

const insertMeeting = (name, date) => {
    const insertQuery = {
        text: `INSERT INTO meetings(name, date) VALUES($1, $2) RETURNING id`,
        values: [name, date],
    }
    return insertQuery;
}

const insertEvent = (meetingId, name) => {
    const insertQuery = {
      text: `INSERT INTO events(meeting_id, name) VALUES($1, $2)`,
      values: [meetingId, name],
    }
    return insertQuery;
}

const insertAthlete = (name) => {
    const insertQuery = {
      text: `INSERT INTO events(name) VALUES($1)`,
      values: [name],
    }
    return insertQuery;
}

const insertResult = (eventId, athleteId, mark, time, position, round) => {
    const insertQuery = {
      text: `INSERT INTO events(event_id, athlete_id, mark, time, position, round) VALUES($1, $2, $3, $4, $5, $6)`,
      values: [eventId, athleteId, mark, time, position, round],
    }
    return insertQuery;
}

async function loadData() {
    const meetings = await saal.getMeetings();
    for (let i = 0, len = meetings.length; i < len; i++) {
        try {
            const res = await db.query(insertMeeting(meetings[i].name, meetings[i].date))
            console.log("HEHEHEHE: ", res.rows[0]);
        }
        catch (err) {
            console.log("COULDN'T RUN QUERY ", err)
        }
    }
}

async function raceResultsToCsvFiles() {
    const data = await meetingRaces();
    for (let i = 0, len = data.length; i < len; i++) {

        for (let j = 0, len = data[i].races.length; j < len; j++) {
            const raceData = await saal.getRaceResults(data[i].races[j].link);
            console.log("==================== ", raceData);
        }
    }
}

loadData();
