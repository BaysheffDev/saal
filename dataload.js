// Require database connection
const db = require('./db.js').dbConnection;

const query = {
    text: 'SELECT *',
    values: [],
}

const createTable = {
    text: `CREATE TABLE meetings(
        id serial PRIMARY KEY,
        name VARCHAR (100) NOT NULL,
        date DATE NOT NULL
    )`,
    values: [],
}


var months = {
    'Jan' : '01',
    'Feb' : '02',
    'Mar' : '03',
    'Apr' : '04',
    'May' : '05',
    'Jun' : '06',
    'Jul' : '07',
    'Aug' : '08',
    'Sep' : '09',
    'Oct' : '10',
    'Nov' : '11',
    'Dec' : '12'
}

db.query(query)
    .then(res => console.log(res))
    .catch(err => console.log("COULDN'T RUN QUERY ", err))
