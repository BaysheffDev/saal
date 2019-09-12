// Require database connection
const db = require('./db.js').dbConnection;

// db.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   db.end()
// })

const selectAll = {
    text: 'SELECT *',
    values: [],
}

const createMeetingsTable = {
    text: `
    CREATE TABLE meetings(
        id serial PRIMARY KEY,
        name VARCHAR (100) NOT NULL,
        date DATE NOT NULL
    )`,
    values: [],
}

const createEventsTable = {
    text: `
    CREATE TABLE events(
        id serial PRIMARY KEY,
        meeting_id INTEGER REFERENCES meetings(id),
        name VARCHAR (100) NOT NULL
    )`,
    values: [],
}

const createAthletesTable = {
  text: `
  CREATE TABLE athletes(
    id serial PRIMARY KEY,
    name VARCHAR (100) NOT NULL
  )`,
  values: [],
}

const createResultsTable = {
    text: `
    CREATE TABLE results(
        id serial PRIMARY KEY,
        event_id INTEGER REFERENCES events(id),
        athlete_id INTEGER REFERENCES athletes(id),
        mark NUMERIC(6,2),
        time VARCHAR(10),
        position VARCHAR(4) NOT NULL,
        round VARCHAR(10)
    )`,
    values: [],
}

const tableQueries = [
  createMeetingsTable,
  createEventsTable,
  createAthletesTable,
  createResultsTable,
];

// Run queries
// Input: array of query objects
async function runQueries(queries) {
  for (let i = 0, len = queries.length; i < len; i++) {
      await db.query(queries[i])
            .then(res => console.log(res))
            .catch(err => console.log("Error - ", err));
  }
}

runQueries(tableQueries);
