/*
* Scrape saal website and load data into postgress database
*/

// 51 meetings should be 3 seasons back
const numberOfMeetings = 171;


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

const insertEvent = (meetingId, distance, category) => {
    const insertQuery = {
      text: `INSERT INTO events(meeting_id, distance, category) VALUES($1, $2, $3) RETURNING id`,
      values: [meetingId, distance, category],
    }
    return insertQuery;
}

const checkAthlete = (name) => {
  const selectQuery = {
    text: `SELECT * FROM athletes WHERE name = $1`,
    values: [name],
  }
  return selectQuery;
}

const insertAthlete = (name) => {
    const insertQuery = {
      text: `INSERT INTO athletes(name) VALUES($1) RETURNING id`,
      values: [name],
    }
    return insertQuery;
}

const insertResult = (eventId, athleteId, mark, time, adjTime, position, round, zscore, zscore1u1d) => {
    const insertQuery = {
      text: `INSERT INTO results(event_id, athlete_id, mark, time, adj_time, position, round, zscore, zscore_1u1d) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      values: [eventId, athleteId, mark, time, adjTime, position, round, zscore, zscore1u1d],
    }
    return insertQuery;
}

// Check if athlete exists in athletes table. If no, add them.
// Return athlete id
async function athleteQuery(name) {
  let id = 0;
  try {
    const athleteCheck = await db.query(checkAthlete(name));
    if (athleteCheck.rows.length < 1) {
        try {
            const newAthlete = await db.query(insertAthlete(name));
            id = newAthlete.rows[0].id;
            console.log("New Athlete: ", id);
        }
        catch(err) {
            console.log("ERROR AT ATHLETE INSERT LEVEL ", err)
        }
    }
    else {
        id = athleteCheck.rows[0].id;
        console.log("Athlete Exists: ", id);
    }
  }
  catch(err) {
    console.log("ERROR AT ATHLETE CHECK LEVEL ", err)
  }
  return id;
}

async function loadData() {
    const meetings = await saal.getMeetings();
    // Insert meetings into meetings table
    for (let i = 0; i < numberOfMeetings; i++) {
        try {
            const newMeeting = await db.query(insertMeeting(meetings[i].name, meetings[i].date))
            const events = await saal.getMeetingRaces(meetings[i].link);
            // Insert events for this meeting into events table with meeting id as FK
            for (let j = 0, len = events.length; j < len; j++) {
              try {
                const meetingId = newMeeting.rows[0].id;
                const newEvent = await db.query(insertEvent(meetingId, events[j].distance, events[j].category));
                const eventId = newEvent.rows[0].id;
                const results = await saal.getRaceResults(events[j].link);
                // Insert results for each event into results table with event id as FK
                for (let k = 0, len = results.length; k < len; k++) {
                  // Get athlete id for the new or existing athlete
                  let athleteId = await athleteQuery(results[k].name);
                  // Insert result
                  try {
                    const newResult = await db.query(
                      insertResult(eventId, athleteId, results[k].mark, results[k].time, results[k].adjtime, results[k].position, results[k].round, results[k].zscore, results[k].zscore1u1d)
                    );
                  }
                  catch (err) {
                    console.log("ERROR AT RESULT LEVEL ", err)
                  }
                }
              }
              catch(err) {
                console.log("ERROR AT EVENT LEVEL ", err)
              }
            }
        }
        catch(err) {
            console.log("ERROR AT MEETING LEVEL ", err);
        }
    }
}

async function test() {
    const data = await meetingRaces();
    for (let i = 0, len = data.length; i < len; i++) {

        for (let j = 0, len = data[i].races.length; j < len; j++) {
            const raceData = await saal.getRaceResults(data[i].races[j].link);
            console.log("==================== ", raceData);
        }
    }
}

loadData();
