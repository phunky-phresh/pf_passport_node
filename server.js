const express = require('express');
const _ = require('underscore');
const ejs = require('ejs');

const server = express();
// set up view engine
server.set('view-engine', ejs); //see docs

// create home route
server.get('/', (req, res) => {
  console.log('GET/');
  res.render('home.ejs');
});

const PORT = 1337;

server.listen(PORT, () => {
  console.log(`Now serving on http://localhost:${ PORT }/`);  
});
