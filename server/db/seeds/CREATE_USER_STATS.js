exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(()=>{
      return knex('users').insert([
         {
          username: 'Alex Amazing',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/balrog.gif',
          '1p_score': 0,
          '2p_score': 0
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
          '1p_score': 933,
          '2p_score': 0
         },
         {
          username: 'Eric Exciting',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/chunli.gif',
          '1p_score': 821,
          '2p_score': 916
         },
         {
          username: 'Francine Flippant',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/dhalsim.gif',
          '1p_score': 933,
          '2p_score': 0
         },
         {
          username: 'George Gorgeous',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/guile.gif',
          '1p_score': 0,
          '2p_score': 962
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
          '1p_score': 905,
          '2p_score': 0
         },
         {
          username: 'Ivan Indignant',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/ryu.gif',
          '1p_score': 784,
          '2p_score': 1842
         },
         {
          username: 'Jack Jumping',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/sagat.gif',
          '1p_score': 0,
          '2p_score': 0
         },
         {
          username: 'Matt Lane',
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/vega.gif',
          '1p_score': 0,
          '2p_score': 1935
         },
         {
          username: "Tom O'Brien",
          password: 'foo',
          thumbnail_url: '/assets/thumbnails/zangief.gif',
          '1p_score': 0,
          '2p_score': 0
         }
      ]).returning('id');
    }).then(ids=>{
      // 'Alex Amazing','Carlos Caring','Darlene Daring','Eric Exciting','Francine Flippant',
      // 'George Gorgeous','Helen Humble','Drew Furth','Ivan Indignant','Jack Jumping',
      // 'Matt Lane',"Tom O'Brien",
      return knex('scores').insert([
         {
           user_id: ids[2], 
           clicks: 7,
           time: 38,
           points: 933,
           result: 'win',
           game_type: '1'
         },
         {
           user_id: ids[2], 
           clicks: 10,
           time: 67,
           points: 0,
           result: 'lose',
           game_type: '2'
         },
         {
           user_id: ids[3],
           clicks: 5,
           time: 67, 
           points: 916, 
           result: 'win', 
           game_type: '2'
         },
         {
           user_id: ids[3],
           clicks: 7,
           time: 102, 
           points: 821, 
           result: 'win', 
           game_type: '1'
         },
         {
           user_id: ids[3],
           clicks: 8,
           time: 101, 
           points: 0, 
           result: 'lose', 
           game_type: '2'
         },
         {
           user_id: ids[4],
           clicks: 7,
           time: 38, 
           points: 933, 
           result: 'win', 
           game_type: '1'
         },
         {
           user_id: ids[5],
           clicks: 12,
           time: 85, 
           points: 0, 
           result: 'lose', 
           game_type: '2'
         },
         {
           user_id: ids[5],
           clicks: 10,
           time: 90, 
           points: 0, 
           result: 'lose', 
           game_type: '2'
         },
         {
           user_id: ids[5],
           clicks: 4,
           time: 32, 
           points: 962, 
           result: 'win', 
           game_type: '2'
         },
         {
           user_id: ids[7],
           clicks: 7,
           time: 54, 
           points: 905, 
           result: 'win', 
           game_type: '1'
         },
         {
           user_id: ids[8],
           clicks: 8,
           time: 48, 
           points: 904, 
           result: 'win', 
           game_type: '2'
         },
         {
           user_id: ids[8],
           clicks: 5,
           time: 49, 
           points: 938, 
           result: 'win', 
           game_type: '2'
         },
         {
           user_id: ids[8],
           clicks: 9,
           time: 96, 
           points: 784, 
           result: 'win', 
           game_type: '1'
         },
         {
           user_id: ids[8],
           clicks: 4,
           time: 24, 
           points: 0, 
           result: 'lose', 
           game_type: '2'
         },
         {
           user_id: ids[8],
           clicks: 12,
           time: 105, 
           points: 0, 
           result: 'lose', 
           game_type: '2'
         },
         {
           user_id: ids[10],
           clicks: 2,
           time: 5, 
           points: 1000, 
           result: 'win', 
           game_type: '2'
         },
         {
           user_id: ids[10],
           clicks: 9,
           time: 111, 
           points: 0, 
           result: 'lose', 
           game_type: '2'
         },
         {
           user_id: ids[10],
           clicks: 6,
           time: 43, 
           points: 935, 
           result: 'win', 
           game_type: '2'
         },
         {
           user_id: ids[11],
           clicks: 8,
           time: 61, 
           points: 0, 
           result: 'lose', 
           game_type: '2'
         },
      ]).returning('id');
    }).then(ids=>{
      return knex('paths').insert([
        {
          score_id: ids[0],
          path: ['Transport Layer Security', 'Web browser', 'World Wide Web', 'Tim Berners-Lee', 'England', 'Association football', 'Football'].join(' -> ')
        },
        {
          score_id: ids[1],
          path: ['Gandalf', 'The Hobbit', 'J.R.R Tolkien', 'Bournemouth', 'England', 'United Kingdom', 'United States of America', 'Apollo 11', 'Moon', 'Colonization of the Moon'].join(' -> ')
        },
        {
          score_id: ids[2],
          path: ['Transport Layer Security', 'Taher Elgamal', 'Egypt', 'Association football', 'Football'].join(' -> ')
        },
        {
          score_id: ids[3],
          path: ['Transport Layer Security', 'Web browser', 'World Wide Web', 'Tim Berners-Lee', 'England', 'Association football', 'Football'].join(' -> ')
        },
        {
          score_id: ids[4],
          path: ['Brody Jenner', 'Celebrity', 'Model (profession)', 'Performance', 'Performing arts', 'William Shakespeare', 'Romeo and Juliet'].join(' -> ')
        },
        {
          score_id: ids[5],
          path: ['Pulp Fiction (film)', 'Quentin Tarantino', 'Knoxville, Tennesse', 'U.S. state', 'California', 'Los Angeles', 'Dodger Stadium', 'Los Angeles Dodgers'].join(' -> ')
        },
        {
          score_id: ids[6],
          path: ['Guernsey', 'Pound sterling', 'Gold penny', 'Silver coin', 'Silver', 'Silver (color)', 'Color'].join(' -> ')
        },
        {
          score_id: ids[7],
          path: ['Brody Jenner', 'California', 'United States', 'California', 'United States', 'North America', 'Continent', 'Europe', 'London', 'United Kingdom', 'William Shakespeare', 'Romeo and Juliet'].join(' -> ')
        },
        {
          score_id: ids[8],
          path: ['Iowa Intercollegiate Athletic Conference', 'Iowa', 'Maize', 'Mexico', 'Fishing', 'Shrimp', 'Shrimp farming', 'Marine shrimp farming', 'Aquaculture', 'Shrimp farm'].join(' -> ')
        },
        {
          score_id: ids[9],
          path: ['Bucharest Corporate Center', 'Bucharest', 'London', 'Boris Johnson'].join(' -> ')
        },
        {
          score_id: ids[10],
          path: ['Birmingham City F.C', 'Birmingham', 'Industrial Revolution', 'United Kingdom of Great Britain and Ireland', 'Representation of the People Act 1918', 'Suffragettes', 'Feminism'].join(' -> ')
        },
        {
          score_id: ids[11],
          path: ['Another Cinderella Story', 'Cinderella', 'Eurasia', 'Europe', 'United Kingdom of Great Britain and Ireland', 'London', 'Whitechapel', 'Jack the Ripper'].join(' -> ')
        },
        {
          score_id: ids[12],
          path: ['Flamenco', 'Japan', 'South Korea', 'Seoul Capital Area', 'Seoul'].join(' -> ')
        },
        {
          score_id: ids[13],
          path: ['Deus Ex: Invisible War', 'Deus Ex: Invisible War characters', 'Deus Ex', 'Illuminati', 'Owl of Minerva', 'Athens', 'Europe', 'Africa', 'Madagascar'].join(' -> ')
        },
        {
          score_id: ids[14],
          path: ['Road to Perdition', 'Crime thriller', 'Literary genre', 'Satire'].join(' -> ')
        },
        {
          score_id: ids[15],
          path: ['Drum and bass', 'The Matrix', 'Science fiction film', 'Film genre', 'Fiction', 'Literary fiction', 'Fiction', "Alice's Adventures in Wonderland", 'Fantasy', 'Chronicles of Narnia', 'The Chronicles of Narnia (film series)', 'The Chronicles of Narnia'].join(' -> ')
        },
        {
          score_id: ids[16],
          path: ['Income tax in the United States', 'Louver'].join(' -> ')
        },
        {
          score_id: ids[17],
          path: ['Progestin', 'Estrogen', 'Greek language', 'Ancient Greek literature', 'Literary genre', 'Comedy', 'Jon Stewart', 'Comedy Central', 'David Letterman'].join(' -> ')
        },
        {
          score_id: ids[18],
          path: ['Birmingham City F.C.', 'Gary Rowett', 'Association football', "Women's association football", 'Woman', 'Feminism'].join(' -> ')
        }
      ]);
    });
};