// Require database connection
const db = require('./db.js').dbConnection;

const query = {
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

const createResultsTable = {
    text: `
    CREATE TABLE results(
        id serial PRIMARY KEY,
        event_id INTEGER REFERENCES events(id),
        athlete_id INTEGER REFERENCES athletes(id),
        mark NUMERIC(4,2),
        time VARCHAR(10)
        position INTEGER NOT NULL,
    )`,
    values: [],
}

const createAthletesTable = {
    text: `
    CREATE TABLE meetings(
        id serial PRIMARY KEY,
        name VARCHAR (100) NOT NULL,
    )`,
    values: [],
}
