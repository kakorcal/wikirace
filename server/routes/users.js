'use strict';
if ((process.env.NODE_ENV || 'development') === 'development') {
  require('dotenv').load();
} 
const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const SALT_WORK_FACTOR = 10;
const SECRET = process.env.JWT_SECRET;
let token;

// only allow AJAX calls to prevent tampering in the browser bar
function checkHeaders(req,res,next){
  if(!req.headers["x-requested-with"]) {
    res.sendFile('/views/layout.html', {root: './client'});
  }else {
    next();
  }
}

// middleware to check the token against params to authorize a user
function checkToken(req, res, next){
  try {
    let decoded = jwt.verify(req.headers.authorization.split(" ")[1], SECRET);
    if(req.params.id && decoded.id === +req.params.id){
      req.decoded_id = decoded.id;
      next();
    }else {
      res.status(401).send("Not Authorized");
    }
  } catch(err) {
    res.status(500).send(err.message);
  }
}

router.use(checkHeaders);

router.post('/new', (req, res)=>{
  knex('users').where({username: req.body.user.username}).first().then(user=>{
    if(user){
      // if user already exists
      res.send({error: 'Username Already Exists'});
    }else{
      bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt)=>{
        if(err) res.send({error: 'An Error Has Occurred In The Database'});
        bcrypt.hash(req.body.user.password, salt, (err, hash)=>{
          if(err) res.send({error: 'An Error Has Occurred In The Database'});
          
          const credentials = _.assign(_.omit(req.body.user, 'password'), {
            password: hash,
            thumbnail_url: '/assets/thumbnails/blanka.gif',
            '1p_score': 0,
            '2p_score': 0
          });

          knex('users').insert(credentials, '*').then(data=>{
            // create token
            let newUser = data[0];
            let listedItems = {id: newUser.id, username: newUser.username};
            token = jwt.sign({id: newUser.id}, SECRET);
            res.send({token, user: listedItems, success: 'Login Successful'});
          }).catch(err=>{
            res.send({error: 'An Error Has Occurred In The Database'});
          });
        });
      });
    }
  })
  .catch(err=>{
    res.send({error: 'An Error Has Occurred In The Database'});
  });
});

router.post('/login', (req, res)=>{
  knex('users').where({username: req.body.user.username}).first().then(user=>{
    if(!user){
      res.send({error: 'Invalid Credentials'});
    }else{
      // check password
      bcrypt.compare(req.body.user.password, user.password, (err, isValid)=>{
        if(err) res.send({error: 'An Error Has Occurred In The Database'});
        
        if(!isValid){
          res.send({error: 'Invalid Credentials'})
        }else{
          // password correct
          // create token
          let listedItems = {id: user.id, username: user.username};
          token = jwt.sign({id: user.id}, SECRET);
          res.send({token, user: listedItems, success: 'Login Successful'});
        }       
      });
    }
  })
  .catch(err=>{
    res.send({error: 'An Error Has Occurred In The Database'});
  });
});

router.get('/users', (req, res)=>{
  knex.select(['u.id', 'u.username', 'u.thumbnail_url', 'u.1p_score', 'u.2p_score'])
    .from('users as u').then(users=>{
      res.send(users);
    }).catch(err=>{
      res.send(err);
    });
});

router.get('/users/:id', checkToken, (req, res)=>{
  // TODO: refactor database to account for rank column instead of using sort. temporary hack
  knex.select(['u.id', 'u.username', 'u.thumbnail_url', 'u.1p_score', 'u.2p_score'])
    .from('users as u').then(users=>{
      let user = users.find(user=>user.id === req.decoded_id);

      user.oneplayer_rank = [...users].sort((a, b)=>{
        return b['1p_score'] - a['1p_score'];
      }).reduce((acc, cur, idx)=>{
        if(cur.id === req.decoded_id) acc = idx + 1;
        return acc;
      }, -1);
      
      user.twoplayer_rank = [...users].sort((a, b)=>{
        return b['2p_score'] - a['2p_score'];
      }).reduce((acc, cur, idx)=>{
        if(cur.id === req.decoded_id) acc = idx + 1;
        return acc;
      }, -1);
      
      knex('scores').where('user_id', req.decoded_id).then(scores=>{
        user.oneplayer_wins = 0;
        user.oneplayer_loses = 0;
        user.twoplayer_wins = 0;
        user.twoplayer_loses = 0;

        scores.forEach(score=>{
          if(score.game_type === '1'){
            if(score.result === 'win'){
              user.oneplayer_wins++;
            }else{
              user.oneplayer_loses++;
            }
          }else{
            if(score.result === 'win'){
              user.twoplayer_wins++;
            }else{
              user.twoplayer_loses++;
            }
          }
        });
        res.send(user);
      });
    })
    .catch(err=>{
      res.send(err);
    });
});

router.put('/users/:id', checkToken, (req, res)=>{
  // TODO: Users should be able to change their password
  // if the username field or thumbnail field is null, don't update
  let updatedUser = req.body.user;
  if(!updatedUser.username) delete updatedUser.username;
  if(!updatedUser.thumbnail_url) delete updatedUser.thumbnail_url;
  // if id only exists
  if(Object.keys(updatedUser).length === 1){
    res.send('Profile Edited');
  }else{
    knex('users').where('id', req.decoded_id).update(updatedUser).then(()=>{
      res.send('Profile Edited');
    }).catch(err=>{
      if(err.constraint === 'users_username_unique'){
        res.send('This User Already Exists');
      }else{
        res.send(err);
      }
    });
  }
});

router.delete('/users/:id', checkToken, (req, res)=>{
  knex('users').where('id', req.decoded_id).del().then(()=>{
    res.send('Delete Successful');
  }).catch(err=>{
    res.send(err);
  });
});

// GAME STATS
router.post('/users/:id', checkToken, (req, res)=>{
  
});

module.exports = router;