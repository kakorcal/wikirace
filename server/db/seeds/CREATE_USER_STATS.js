exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(()=>{
      return knex('users').insert([
         {
          username: 'Alex Amazing',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/balrog.gif',
          '1p_score': 29887,
          '2p_score': 3145
         },
         {
          username: 'Carlos Caring',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/bison.gif',
          '1p_score': 0,
          '2p_score': 0
         },
         {
          username: 'Darlene Daring',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/blanka.gif',
          '1p_score': 5490,
          '2p_score': 3555
         },
         {
          username: 'Eric Exciting',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/chunli.gif',
          '1p_score': 14870,
          '2p_score': 4090
         },
         {
          username: 'Francine Flippant',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/dhalsim.gif',
          '1p_score': 3590,
          '2p_score': 1600
         },
         {
          username: 'George Gorgeous',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/guile.gif',
          '1p_score': 29887,
          '2p_score': 3145
         },
         {
          username: 'Helen Humble',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/honda.gif',
          '1p_score': 0,
          '2p_score': 0
         },
         {
          username: 'Drew Furth',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/ken.gif',
          '1p_score': 0,
          '2p_score': 0
         },
         {
          username: 'Ivan Indignant',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/ryu.gif',
          '1p_score': 760,
          '2p_score': 4200
         },
         {
          username: 'Jack Jumping',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/sagat.gif',
          '1p_score': 7680,
          '2p_score': 2000
         },
         {
          username: 'Matt Lane',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/vega.gif',
          '1p_score': 530,
          '2p_score': 30000
         },
         {
          username: "Tom O'Brien",
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/zangief.gif',
          '1p_score': 800,
          '2p_score': 3145
         }
      ]).returning('id');
    }).then(ids=>{
      return knex('paths').insert([
         {
          user_id: ids[0], 
          start: 'foo',
          end: 'bar',
          path: 'foo,baz,bar'
         },
         {
          user_id: ids[1], 
          start: 'foo',
          end: 'bar',
          path: 'foo,baz,bar'
         },
         {
          user_id: ids[2], 
          start: 'foo',
          end: 'bar',
          path: 'foo,baz,bar'
         },
         {
          user_id: ids[3], 
          start: 'foo',
          end: 'bar',
          path: 'foo,baz,bar'
         },
         {
          user_id: ids[4], 
          start: 'foo',
          end: 'bar',
          path: 'foo,baz,bar'
         },
      ]).returning('id');
    }).then();
};