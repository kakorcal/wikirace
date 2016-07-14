'use strict';
require('dotenv').load();
const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const SALT_WORK_FACTOR = 10;
const SECRET = process.env.LOCAL_SECRET;
let token;

// only allow AJAX calls to prevent tampering in the browser bar
function checkHeaders(req,res,next){
  if(!req.headers["x-requested-with"]) {
    res.sendFile(path.join(__dirname, '../../client', 'index.html'));
  }
  else {
    next();
  }
}

// middleware to check the token against params to authorize a user
function checkToken(req,res,next){
  try {
    var decoded = jwt.verify(req.headers.authorization.split(" ")[1], SECRET);
    if(req.params.id && decoded.id === req.params.id){
      req.decoded_id = decoded.id;
      next();
    }else {
      res.status(401).send("Not Authorized");
    }
  } catch(err) {
    res.status(500).send(err.message);
  }
}

// middleware to check the token in general
function checkTokenForAll(req,res,next){
  try {
    var decoded = jwt.verify(req.headers.authorization.split(" ")[1], secret);
    next();
  }
  catch(err) {
    res.status(500).send(err.message);
  }
}

router.use(checkHeaders);

router.post('/new', (req, res, next)=>{
  knex('users').where({username: req.body.user.username}).first().then(user=>{
    if(user){
      // if user already exists
      res.json({error: 'Username Already Exists'});
    }else{
      bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt)=>{
        if(err) res.json({error: 'An Error Has Occurred In The Database'});
        bcrypt.hash(req.body.user.password, salt, (err, hash)=>{
          if(err) res.json({error: 'An Error Has Occurred In The Database'});
          
          const credentials = _.assign(_.omit(req.body.user, 'password'), {
            password: hash,
            thumbnail_url: '/assets/thumbnails/blanka.gif',
            '1p_score': 0,
            '2p_score': 0
          });
          
          knex('users').insert(credentials, '*').then(([newUser])=>{
            // create token
            let listedItems = {id: newUser.id, username: newUser.username};
            token = jwt.sign({id: newUser.id}, SECRET);
            res.json({token, user: listedItems, success: 'Login Successful'});
          }).catch(err=>{
            res.json({error: 'An Error Has Occurred In The Database'});
          });
        });
      });
    }
  });
});

router.post('/login', (req, res, next)=>{

});

router.get('/logout', (req, res)=>{

});

router.get('/users', (req, res)=>{
  knex.select(['u.id', 'u.username', 'u.thumbnail_url', 'u.1p_score', 'u.2p_score'])
    .from('users as u').then(users=>{
      res.send(users);
    }).catch(err=>{
      res.send(err);
    });
});

router.get('/users/:id', (req, res)=>{
  knex('users').where('id', +req.params.id).first().then(user=>{
    delete user.password;
    res.send(user);
  }).catch(err=>{
    res.send(err);
  });
});

router.put('/users/:id', (req, res)=>{
  knex('users').where('id', +req.params.id).update(req.body.user).then(()=>{
    res.send('Update Successful');
  }).catch(err=>{
    res.send(err);
  });
});

router.delete('/users/:id', (req, res)=>{
  knex('users').where('id', +req.params.id).del().then(()=>{
    res.send('Delete Successful');
  }).catch(err=>{
    res.send(err);
  });
});

module.exports = router;