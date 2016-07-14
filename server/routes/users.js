'use strict';
const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const SALT_WORK_FACTOR = 10;
const SECRET = process.env.LOCAL_SECRET;
let token;

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

router.get('/users', (req, res)=>{
  knex('users').then(users=>{
    res.send(users);
  }).catch(err=>{
    res.send(err);
  })
});

router.get('/users/:id', (req, res)=>{
  knex('users').where('id', +req.params.id).first().then(user=>{
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