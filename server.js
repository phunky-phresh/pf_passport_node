const express = require('express');
const ejs = require('ejs');
const authRoutes = require('./routes/auth-routes');
require('dotenv').config();

const passportSetup = require('./config/passport-setup');

const server = express();
// set up view engine
server.set('view-engine', ejs); //see docs

//set up routes
server.use('/auth', authRoutes);

// create home route
server.get('/', (req, res) => {
  console.log('GET/');
  res.render('home.ejs');
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Now serving on http://localhost:${ PORT }/`);  
});
