const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const _ = require('lodash');
const SALT_WORK_FACTOR = 10;

// This passport middleware searches req.body and grabs the username and plain-text password
passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]',
  passReqToCallback: true
}, 
  // This callback includes the username and password that has been specified in the object above.
  function verifyLocal(req, username, password, done){
    console.log('VERIFY');

    knex('users').where({username}).first().then(user=>{
      // applies only when logging in
      if(!user) return done(null, false, 'Username Does Not Exist');
      // using for both creating account and logging in
      bcrypt.compare(password, user.password, (err, res)=>{
        if(err) return done(err);

        if(!res) {
          // applies only when logging in
          return done(null, false, 'Incorrect Password');
        }else{
          return done(null, user, 'Login Successful');
        }
      });
    }).catch(err=>{
      return done(err);
    }); 
  }
));

passport.serializeUser(function(user, done){
  console.log('SERIALIZE');
  // set req.session.id = user.id
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log('DESERIALIZE');
  knex('users').where("id", id).first().then(user => {
    done(null, user);
  }).catch(err => {
    done(err);
  });
});

router.post('/new', (req, res, next)=>{
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt)=>{
    bcrypt.hash(req.body.user.password, salt, (err, hash)=>{
      const credentials = _.assign(_.omit(req.body.user, 'password'), {password: hash});
      knex('users').insert(credentials).then(()=>{
        passport.authenticate('local', (err, user, message)=>{
          console.log('Authenticate after creating account');
          // if there is an err, goto the next middleware
          // in this case, it will bubble up to the error handlers located in app.js
          if(err) return next(err);
          // if user has successfully created an account or verified their 
          // credentials call the logIn method. 
          // When logIn is invoked, user is passed to serializeUser (if creating an account or 
          // if they have an account and they are trying to login) and deserializeUser (this method 
          // is called everytime to check if the stamp, aka session still exists)
          req.logIn(user, err=>{
            // This callback is invoked only after serializing and deserializing
            if(err) return next(err);
            res.send(message);
          });
        })(req, res, next);
      }).catch(err=>{
        // applies only when creating an account
        res.send('Username Already Exists');
      });
    });
  });
});

router.post('/login', (req, res, next)=>{

});

router.get('/logout', (req, res)=>{

});

router.get('/status', (req, res)=>{
  // return the login status of the user
});

module.exports = router;