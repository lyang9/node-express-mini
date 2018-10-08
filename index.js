// implement your API here
// how to import  / export code between files
// introduce how routing works

// import express from 'express'; //ES2015 modules > export default someCode;
const express = require('express'); //CommonJS modules > module.exports = someCode;
const cors = require('cors'); // install this package to connect from react

const db = require('./data/db.js');

const server = express(); // creates the server

server.use(express.json()); // formatting our req.body obj.
server.use(cors()); // this needed to connect from react

server.get('/', (req, res) => { 
  // request/route handler
  res.send('<h1>Hello FSW13!</h1>');
});

server.get('/api/users', (req, res) => {
  console.log(req.query);
  db.find().then(users => {
    console.log('\n** users **', users);
    res.json(users);
  })
  .catch(err => res.send(err));
});

server.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.json(err);
    });
});

server.post('/api/users', (req, res) => {
  const { name, bio } = req.body;
  const newUser = { name, bio };
  db.insert(newUser)
    .then(userId => {
      const { id } = userId;
      db.findById(id).then(user => {
        console.log(user);
        if (!user) {
          return res
            .status(422)
            .send({ Error: `User does not exist by that id ${userId}` });
        }
        res.status(201).json(user);
      });
    })
    .catch(err => console.error(err));
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(removedUser => {
      console.log(removedUser);
      res.status(200).json(removedUser);
    })
    .catch(err => console.error(err));
});

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  const newUser = { name, bio };
  console.log(newUser);
  db.update(id, newUser)
    .then(user => {
      console.log(user);
      res.status(200).json(user);
    })
    .catch(err => console.error(err));
});

// watch for traffic in a particular computer port
const port = 8000;
server.listen(port, () => 
  console.log(`\n=== API running on port ${port} ===\n`)
);

// http://localhost:3000 > 3000 is the port
// 80: http, 443: https, 25: email servers
// npm run server or yarn server in our case