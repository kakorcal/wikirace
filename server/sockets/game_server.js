'use strict';
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
    Promise.all([generateRandomTitle('/wiki/Alaska'), generateRandomTitle('/wiki/Yukon')]).then(titles=>{
      socket.emit('Receive Titles', titles);
    }).catch(err=>{
      socket.emit('Error', 'Failed To Retrieve Data');
    });
  });

  socket.on('Generate Article', PATH=>{
    let title, text, content, thumbnail, linkTags, styles;

    rp({uri: `${BASE_URL}${PATH}`, transform: body=>cheerio.load(body)})
      .then($=>{
        title = $('#firstHeading').html();
        text = $('#firstHeading').text();

        thumbnail = $('#mw-content-text .infobox .image img').attr('src');
        
        content = $('#bodyContent').html()
          .replace(/href=('|"|‘|’|“|”)\/wiki\/.+?('|"|‘|’|“|”)/g, match=>{
            return `href='#' ng-click=vm.generateArticle(${match.substring(5, match.length)})`;
          });
        
        linkTags = $("link[rel='stylesheet']").map((idx, elem)=>{
          return rp(`${BASE_URL}${elem.attribs.href}`);
        }).get();        

        return Promise.all(linkTags);
      })
      .then(stylesheets=>{
        styles = stylesheets.join('');
        socket.emit('Receive Article', {title, text, content, thumbnail, styles});
      })
      .catch(err=>{
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
function generateRandomTitle(STR){
  return rp({uri: `${BASE_URL}${STR}`, transform: body=>cheerio.load(body)})
    .then($=>{
      return $('#firstHeading').text();
    })
    .catch(err=>{
      return err;
    });
}
