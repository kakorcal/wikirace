const router = require('express').Router();
const knex = require('../db/knex');

router.get('/', (req, res)=>{
  knex('users').then(users=>{
    res.send(users);
  }).catch(err=>{
    res.send(err);
  })
});

router.get('/:id', (req, res)=>{
  knex('users').where('id', +req.params.id).first().then(user=>{
    res.send(user);
  }).catch(err=>{
    res.send(err);
  });
});

router.put('/:id', (req, res)=>{
  knex('users').where('id', +req.params.id).update(req.body.user).then(()=>{
    res.send('Update Successful');
  }).catch(err=>{
    res.send(err);
  });
});

router.delete('/:id', (req, res)=>{
  knex('users').where('id', +req.params.id).del().then(()=>{
    res.send('Delete Successful');
  }).catch(err=>{
    res.send(err);
  });
});

module.exports = router;