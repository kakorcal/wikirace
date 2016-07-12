const cheerio = require('cheerio');
const rp = require('request-promise');
const BASE_URL = 'https://en.wikipedia.org';
const RANDOM_PAGE = '/wiki/Special:RandomInCategory/Featured_articles';

exports.init = (io, socket)=>{
  console.log('CLIENT HANDSHAKE');
  //***************************************************************************
    // ONE PLAYER
  //***************************************************************************
  socket.on('Setup One Player Game', ()=>{
    // get two random articles
    Promise.all([generateRandomTitle(), generateRandomTitle()]).then(titles=>{
      socket.emit('Retrieve Article Titles', titles);
    }).catch(err=>{
      socket.emit('Error', 'Failed To Retrieve Data');
    });
  });
  //***************************************************************************
    // END
  //***************************************************************************

  socket.on('disconnect', ()=>{
    console.log('CLIENT DISCONNECT');
  });
};

//***************************************************************************
  // HELPERS
//***************************************************************************
function generateRandomTitle(){
  return rp({uri: `${BASE_URL}${RANDOM_PAGE}`, transform: body=>cheerio.load(body)})
    .then($=>{
      return $('#firstHeading').text();
    })
    .catch(err=>{
      return err;
    });
}
