const express = require('express');
const mysql = require('mysql2/promise');
const { faker }  = require('@faker-js/faker');

const app = express();
const port = process.env.APP_PORT || 3000;

const config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

app.get('/', async (req, res) => {
  try {
    await insertPerson(res);
  } catch (error) {
    console.error('error:', error);
    res.status(500).send('internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

async function insertPerson(res) {  
  const name = faker.person.firstName()

  const connection = await mysql.createConnection(config);
  const sql = `INSERT INTO people(name) values(?)`;

  try {
    await connection.execute(sql, [name]);
    console.log(`${name} was inserted`);
    await getPersons(res, connection);
  } catch (error) {
    console.error('error inserting person:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function getPersons(res, connection) {
  const sql = `SELECT id, name FROM people`;

  try {
    const [results] = await connection.execute(sql);
    let response = '<h1>Full Cycle Rocks!</h1>';
    response += '<ul>';
    results.forEach(row => {
      response += `<li>${row.name}</li>`;
    });
    response += '</ul>';
    res.send(response);
  } catch (error) {
    console.error('error fetching persons:', error);
    throw error;
  }
}
