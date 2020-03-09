require("dotenv").config();

const pgp = require("pg-promise")({
  query: function(e) {
    console.log("QUERY", e.query);
  }
});

const options = {
  host: process.env["DB_HOST"],
  database: process.env["DB_NAME"]
};

const db = pgp(options);

module.exports = db;
