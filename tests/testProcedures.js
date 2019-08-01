const connection = require('../config/db');
const findUserQuery = "CALL getPeopleByEmail('wdl44ww8@yahoo.com')";
connection.query(findUserQuery, (err, row) => {
    console.log(row[0][0]);
    return;
});
