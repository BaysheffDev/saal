// Scrape saal website and load data into postgress database

// Require database connection
const db = require('./db.js').dbConnection;
// Import custom webscraping functions
const saal = require('./saalWebsiteData.js');

const query = {
    text: 'SELECT *',
    values: [],
}

const createMeetingsTable = {
    text: `CREATE TABLE meetings(
        id serial PRIMARY KEY,
        name VARCHAR (100) NOT NULL,
        date DATE NOT NULL
    )`,
    values: [],
}

const insertMeets = (name, date) => {
  const insertQuery = {
    text: `INSERT INTO meetings(name, date) VALUES($1 $2)`,
    values: [name, date],
  }
  return insertQuery;
}

async function insertMeetings() {
  const meetings = await saal.getMeetings();
  for (let i = 0, len = meetings.length; i < len; i++) {
    // db.query(insertMeets(meetings[i].name, meeting[i].date))
    //     .then(res => console.log(res))
    //     .catch(err => console.log("COULDN'T RUN QUERY ", err))
    console.log(meetings[i].name);
    console.log(meetings[i].date);
  }
}

// db.query(createTable)
//     .then(res => console.log(res))
//     .catch(err => console.log("COULDN'T RUN QUERY ", err))
