'use strict';
const cheerio = require('cheerio');
const rp = require('request-promise');
const BASE_URL = 'https://en.wikipedia.org';
const RANDOM_PAGE = '/wiki/Special:RandomInCategory/Featured_articles';

// TODO: find random category first. and within that category, select two articles

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
  //***************************************************************************
    // END
  //***************************************************************************

  socket.on('Generate Article', PATH=>{
    let title, text, content, thumbnail, linkTags, styles, path = PATH;

    rp({uri: `${BASE_URL}${PATH}`, transform: body=>cheerio.load(body)})
      .then($=>{
        title = $('#firstHeading').html();
        text = $('#firstHeading').text();

        thumbnail = $('#mw-content-text .infobox .image img').attr('src');
        
        content = $('#bodyContent').html()
          .replace(/href=('|"|‘|’|“|”).+?('|"|‘|’|“|”)/g, match=>{
            return processLinks(match);
          });

        linkTags = $("link[rel='stylesheet']").map((idx, elem)=>{
          return rp(`${BASE_URL}${elem.attribs.href}`);
        }).get();        

        return Promise.all(linkTags);
      })
      .then(stylesheets=>{
        styles = stylesheets.join('');
        socket.emit('Receive Article', {title, text, content, thumbnail, styles, path});
      })
      .catch(err=>{
        socket.emit('Error', 'Failed To Retrieve Data');
      });
  });

  socket.on('Player Win', ()=>{
    socket.emit('Finish Game');
  });

  socket.on('disconnect', ()=>{
    console.log('CLIENT DISCONNECT');
  });
};

// TODO: Put these in helpers file
//***************************************************************************
  // HELPERS
//***************************************************************************
function generateRandomTitle(path){
  return rp({uri: `${BASE_URL}${RANDOM_PAGE}`, transform: body=>cheerio.load(body)})
    .then($=>{
      return $('#firstHeading').text();
    })
    .catch(err=>{
      return err;
    });
}

// TODO: this does not work for this case: //species.wikimedia.org/wiki/Sitta_przewalskii
function processLinks(str){
  if(str.includes('/wiki/') && str.search(/(:|#|jpg|jpeg|png|gif)/) === -1){
    // regular links
    return `href='#' ng-click=vm.generateArticle('${str.substring(6, str.length-1)}')`;
  }else if(str.includes('#') && str.search(/(\/wiki\/|http)/) === -1){
    // anchor tags
    return `target='_self' class='wiki-clickable' ng-click=vm.onHashClick('${str.substring(7, str.length-1)}')`;
  }else{
    // disable everything else
    return "class='wiki-disabled'";
  }
}
