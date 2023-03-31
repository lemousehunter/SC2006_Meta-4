const bodyParser = require('body-parser');
const session = require('express-session');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'my-secret-key',
  resave: true,
  saveUninitialized: true
}));

app.get('/private-chat', function(req, res){
  res.sendFile(__dirname + '/private-chat.html');
});

io.on('connection', function(socket){
  socket.on('private-chat-message', function(msg){
    io.emit('private-chat-message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});