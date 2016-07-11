const express = require('express');
const app = express();
const routes = require('./routes/index');
// const game = require("./game_server");
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

if(app.get('env') === 'development'){
  require('dotenv').load();
}

app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/libs', express.static(`${__dirname}../node_modules`));
app.use('/javascripts', express.static(`${__dirname}../client/javascripts`));
app.use('/stylesheets', express.static(`${__dirname}../client/stylesheets`));
app.use('/assets', express.static(`${__dirname}../client/assets`));
app.use('/views', express.static(`${__dirname}../client/views`));
app.use('/api/users', routes.users);

app.get('*', (req, res)=>{
  res.sendFile('views/layout.html', {root: './client'});
});

server.listen(PORT, ()=>{
  console.log(`Listening to port ${PORT}`);
});

io.on('connection', socket=>{
  console.log('CLIENT HANDSHAKE');
  // game.init(io, socket);
});