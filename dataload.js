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
      text: `INSERT INTO events(meeting_id, name) VALUES($1, $2) RETURNING id`,
      values: [meetingId, name],
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
      text: `INSERT INTO events(name) VALUES($1) RETURNING id`,
      values: [name],
    }
    return insertQuery;
}

const insertResult = (eventId, athleteId, mark, time, position, round) => {
    const insertQuery = {
      text: `INSERT INTO events(event_id, athlete_id, mark, time, position, round) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      values: [eventId, athleteId, mark, time, position, round],
    }
    return insertQuery;
}

async function loadData() {
    const meetings = await saal.getMeetings();
    // Insert meetings into meetings table
    for (let i = 0, len = meetings.length; i < 1; i++) {
        try {
            const newMeeting = await db.query(insertMeeting(meetings[i].name, meetings[i].date))
            console.log("New meeting: ", newMeeting);
            const events = await saal.getMeetingRaces(meetings[i].link);
            // Insert events for this meeting into events table with meeting id as FK
            for (let j = 0, len = events.length; j < len; j++) {
              try {
                const meetingId = newMeeting.rows[0].id;
                const newEvent = await db.query(insertEvent(events[j].name, meetingId));
                console.log("New Event: ", newEvent);
                const eventId = newEvent.rows[0].id;
                const results = await saal.getRaceReults(events[j].link);
                // Insert results for each event into results table with event id as FK
                for (let k = 0, len = results.length; k < len; k++) {
                  // Check if athlete exists in athletes table. If no, add them.
                  // Set the athlete id
                  const athleteId = 0;
                  try {
                    const athleteCheck = db.query(checkAthlete(results[k].name));
                    if (!athleteCheck.rows[0].id) {
                      const newAthlete = db.query(insertAthlete(results[k].name));
                      athleteId = newAthlete.rows[0].id;
                      console.log("New Athlete: ", athleteId);
                    }
                    else {
                      athleteId = athleteCheck.rows[0].id;
                      console.log("Athlete Exists: ", athleteId);
                    }
                  }
                  catch(err) {
                    console.log("ERROR AT ATHLETE LEVEL ", err)
                  }
                  // Insert result
                  const mark = results[k].mark;
                  const time = results[k].time;
                  const position = results[k].position;
                  const round = results[k].round;
                  try {
                    const newResult = db.query(insertResult(eventId, athleteId, mark, time, position, round));
                    console.log("New Result: ", newResult);
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
