require('dotenv').config();

module.exports = {
  "type": "postgres",
  "host": process.env.HOST,
  "port": process.env.PORT,
  "username": process.env.USERNAME,
  "password": process.env.PASSWORD,
  "database": process.env.DATABASE,
  "entities": [
      "dist/**/**.entity{.ts,.js}"
  ],
  "synchronize": true
};
