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
        mark NUMERIC(4,2),
        time VARCHAR(10),
        position INTEGER NOT NULL,
        round VARCHAR(10)
    )`,
    values: [],
}



const testTable = {
    text: `
    CREATE TABLE test(
        id serial PRIMARY KEY,
        name VARCHAR(10) NOT NULL
    )`,
    values: [],
}
const testTable2 = {
    text: `
    CREATE TABLE test2(
        id serial PRIMARY KEY,
        color VARCHAR(10) NOT NULL,
        test1_id INTEGER REFERENCES test(id)
    )`,
    values: [],
}

const tableQueries = [
  createMeetingsTable,
  createEventsTable,
  createAthletesTable,
  createResultsTable,
  // testTable,
  // testTable2
];

// Run queries
// Input: array of query objects
async function runQueries2(queries) {
  for (let i = 0, len = queries.length; i < len; i++) {
      await db.query(queries[i])
            .then(res => console.log(res))
            .catch(err => console.log("Error - ", err));
  }
}

const runQueries = function(queries) {
  let p = Promise.resolve();
  queries.forEach(q =>
      p = p.then(() => db.query(q))
           .catch(err => console.log(err))
  );
  return p;
};

runQueries2(tableQueries);
