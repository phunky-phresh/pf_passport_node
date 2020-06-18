const express = require('express');
const ejs = require('ejs');
const authRoutes = require('./routes/auth-routes');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');
const passport = require('passport');

const server = express();


// set up view engine
server.set('view-engine', ejs); //see docs

server.use(cookieSession({
  maxAge: 24 * 60 * 60 * 10000,
  keys:[process.env.SESSION]
}));

// initialize passport
server.use(passport.initialize());
server.use(passport.session());

//set up routes
server.use('/auth', authRoutes);

// create home route
server.get('/', (req, res) => {
  console.log('GET/');
  res.render('home.ejs');
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Now serving on http://localhost:${ PORT }/`);  
});


