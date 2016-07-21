'use strict';
const cheerio = require('cheerio');
const rp = require('request-promise');
const helpers = require('../helpers/socketHelpers');
const BASE_URL = 'https://en.wikipedia.org';
const WIKILIST = '/wiki/Wikipedia:WikiProject_';
// TOPIC LINKS: https://en.wikipedia.org/wiki/Wikipedia:Lists_of_popular_pages_by_WikiProject

// two player variables
let gametype = null;
let players = {};

// TODO: find random category first. and within that category, select two articles
// get all categories from https://en.wikipedia.org/wiki/Portal:Contents/Categories
// pick a random category and attach to '/wiki/Special:RandomInCategory/${RANDOM}'
// if the resulting page is a category page, do the special random search again
  // example:
  // const RANDOM_PAGE = '/wiki/Special:RandomInCategory/Featured_articles';
  // start from https://en.wikipedia.org/wiki/Special:RandomInCategory/Companies
  // this results in https://en.wikipedia.org/wiki/Category:Companies_by_region
  // so do another search with https://en.wikipedia.org/wiki/Special:RandomInCategory/Companies_by_region
  // keep going until the query does not include ':'
// if the resulting path starts with 'List'
// if the query leads to an article, take out the # if it exists

exports.init = (io, socket)=>{
  console.log('CLIENT HANDSHAKE');
  //***************************************************************************
    // ONE PLAYER
  //***************************************************************************
  socket.on('Setup One Player Game', ()=>{
    gametype = '1';
    // get two random articles
    Promise.all([generateRandomTopic(), generateRandomTopic()])
      .then(topics=>{
        let titles = helpers.replaceInvalidTopics(
            helpers.findUniqueTopics(topics[0], topics[1])
          );
        return Promise.all([generateTitle(titles[0]), generateTitle(titles[1])]);
      })
      .then(titles=>{
        // Mediterranean Basin Error 
          // UPDATE: error is caused by angular trying to evaluate wikipedia templates
          // which have the same double bracket notation. 
        // socket.emit('Receive Titles', ['Mediterranean Basin', titles[1]]);
        // https://docs.angularjs.org/error/$parse/ueoe
        socket.emit('Receive Titles', titles);
      })
      .catch(err=>{
        socket.emit('Error', 'Failed To Retrieve Data');
      });
  });
  //***************************************************************************
    // END
  //***************************************************************************
  //***************************************************************************
    // TWO PLAYER
  //***************************************************************************
  socket.on('Setup Two Player Game', ()=>{
    gametype = '2';
    console.log('Setup Two Player Game', socket.client.id);
    // only two players per game
    if(Object.keys(players).length < 2){
      socket.emit('Receive Socket Id', socket.client.id);
    }else{
      socket.emit('Room Full');
    }
  });

  socket.on('Reset Two Player Game', ()=>{
    socket.emit('Receive Socket Id', socket.client.id);
  });

  socket.on('Add Player To Room', player=>{
    console.log('PLAYER ADDED', player);
    if(player.playCount === 0){
      console.log('NEW PLAYER', player);
      // need to add into room
      players[player.socketId] = player;
      console.log('PLAYERS', players);
      socket.join('Wiki Room');
    }
    console.log('BEFORE ISREADY CHECK');
    if(Object.keys(players).length === 2){
    console.log('INSIDE ISREADY CHECK');
      // check if both players are ready
      if(isReady(players)){
        console.log('ON ISREADY CHECK');
        console.log('PLAYERS READY', players);
        io.to('Wiki Room').emit('Set Players', players);
      }else{
        console.log('NOT READY', players);
      }
    }
  });

  socket.on('Load Game', ()=>{
    Promise.all([generateRandomTopic(), generateRandomTopic()])
      .then(topics=>{
        let titles = helpers.replaceInvalidTopics(
            helpers.findUniqueTopics(topics[0], topics[1])
          );
        return Promise.all([generateTitle(titles[0]), generateTitle(titles[1])]);
      })
      .then(titles=>{
        console.log(titles);
        // ['Alaska', 'Yukon']
        // pokemon go -> gps -> united states -> george washington
        io.to('Wiki Room').emit('Receive Titles', ['Pokémon Go', 'George Washington']);  
      })
      .catch(err=>{
        socket.emit('Error', 'Failed To Retrieve Data');
      });
  });

  socket.on('Start Game', ()=>{
    socket.emit('Load Initial Article');
  });

  socket.on('Set Countdown', ()=>{
    socket.emit('Start Countdown');
  });

  socket.on('Update Clicks', player=>{
    io.to('Wiki Room').emit('Receive Updated Clicks', player);
  });

  socket.on('Post Game Update', player=>{
    console.log('UPDATE PLAYER', player);
    players[player.socketId] = player;
    console.log('POST GAME UPDATE', players);
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
        
        // Angular Error still occurs without the replace method
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

  socket.on('Game Finished', player=>{
    if(player && gametype === '2'){
      io.to('Wiki Room').emit('Evaluate Score', player);
    }else{
      socket.emit('Evaluate Score');
    }
  });

  socket.on('disconnect', ()=>{
    if(gametype === '2'){
      if(players[socket.client.id]){
        delete players[socket.client.id];
        console.log('player deleted', socket.client.id);
        console.log('remaining player', players);
        console.log('ON DISCONNECT');
        socket.leave('Wiki Room');
        io.to('Wiki Room').emit('Player Leave', players);      
      }else{
        console.log('ROOM FULL');
        console.log('disconnected', socket.client.id);
        console.log('players', players);
      }
    }
    console.log('CLIENT DISCONNECT');
  });
};

// TODO: Put these in helpers file
//***************************************************************************
  // HELPERS
//***************************************************************************

function isReady(players){
  for(let prop in players){
    if(!players[prop].isReady) return false;
  }
  return true;
}

function generateTitle(PATH){
  return rp({uri: `${BASE_URL}${PATH}`, transform: body=>cheerio.load(body)})
    .then($=>{
      return $('#firstHeading').text();
    })
    .catch(err=>{
      return err;
    });
}

function generateRandomTopic(){
  let uri = `${BASE_URL}${WIKILIST}${helpers.getRandomElement(helpers.topics())}/Popular_pages`;
  return rp({uri, transform: body=>cheerio.load(body)})
    .then($=>{
      let paths = $('.wikitable tr td:nth-child(2)').map((idx, elem)=>{
        return elem.children[0].attribs.href;
      }).get();

      return paths.length > 20 ? paths.slice(0, 20) : paths;
    })
    .catch(err=>{
      return err
    });  
}

// TODO: this does not work for this case: //species.wikimedia.org/wiki/Sitta_przewalskii
function processLinks(str){
  if(str.includes('/wiki/') && str.search(/(:|#|jpg|jpeg|png|gif)/) === -1){
    // regular links
    return `href='#' ng-click=vm.generateArticle('${str.substring(6, str.length-1)}')`;
  }else if(str.includes('#') && str.search(/(\/wiki\/|http|\d)/) === -1){
    // anchor tags
    return `target='_self' class='wiki-clickable' ng-click=vm.onHashClick('${str.substring(7, str.length-1)}')`;
  }else{
    // disable everything else
    return "class='wiki-disabled'";
  }
}
