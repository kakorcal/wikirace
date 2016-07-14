'use strict';
const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const SALT_WORK_FACTOR = 10;
let token;

router.post('/new', (req, res, next)=>{
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt)=>{
    bcrypt.hash(req.body.user.password, salt, (err, hash)=>{
      const credentials = _.assign(_.omit(req.body.user, 'password'), {
        password: hash,
        thumbnail_url: '/assets/thumbnails/blanka.gif',
        '1p_score': 0,
        '2p_score': 0
      });

      knex('users').insert(credentials).then(()=>{
        
      }).catch(err=>{
        // applies only when creating an account
        res.send({message: 'Username Already Exists'});
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