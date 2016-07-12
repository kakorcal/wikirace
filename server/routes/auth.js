const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

router.post('/new', (req, res)=>{
  knex('users').insert(req.body.user).then(()=>{
    res.send('Account Created!');
  }).catch(err=>{
    res.send('Username Already Exists');
  });
});

module.exports = router;