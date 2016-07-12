const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').LocalStrategy;
const _ = require('lodash');
const SALT_WORK_FACTOR = 10;

passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]',
  passReqToCallback: true
}, function verifyLocal(req, username, password, done){
  
}));

router.post('/new', (req, res)=>{
  knex('users').insert(req.body.user).then(()=>{
    res.send('Account Created!');
  }).catch(err=>{
    res.send('Username Already Exists');
  });
});

module.exports = router;