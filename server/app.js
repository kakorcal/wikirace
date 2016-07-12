const express = require('express');
const app = express();
const routes = require('./routes/index');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3333;

if(app.get('env') === 'development'){
  require('dotenv').load();
}

app.use(require('morgan')('dev'));
app.use(require('cookie-session')({secret: process.env.LOCAL_SECRET}));
app.use(require('passport').initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// static files
app.use('/javascripts', express.static(`${__dirname}/../client/javascripts`));
app.use('/stylesheets', express.static(`${__dirname}/../client/stylesheets`));
app.use('/assets', express.static(`${__dirname}/../client/assets`));
app.use('/views', express.static(`${__dirname}/../client/views`));
app.use('/libs', express.static(`${__dirname}/../node_modules`));

// routes
app.use('/api/users', routes.users);
app.use('/auth', routes.auth);

app.get('*', (req, res)=>{
  res.sendFile('/views/layout.html', {root: './client'});
});

// error handlers
// props to https://github.com/mjhea0/mean-auth/blob/master/server/app.js
app.use((req, res, next)=>{
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res)=>{
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

server.listen(PORT, ()=>{
  console.log(`Listening to port ${PORT}`);
});

io.on('connection', socket=>{
  console.log('CLIENT HANDSHAKE');
  // game.init(io, socket);
});