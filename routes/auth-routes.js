const router = require('express').Router();
const passport = require('passport');

// auth login
router.get('/login', (req, res) => {
  res.render('login.ejs');
});

// auth logout
router.get('/logout', (req, res) => {
  //handle with passport
  res.send('logging out')
});

// auth with google
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  
  // res.send(req.user);
  console.log('redirect, auth-routes', req.user);
  res.redirect('http://localhost:3000/')
  
})

module.exports = router;