// import chat model
const Chat = require('./models/chat');

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('New user connected');

    // handle chat messages
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);

      // save chat message to database
      const chat = new Chat({
        message: msg
      });

      chat.save().then(() => {
        console.log('Chat message saved to database');
      }).catch((err) => {
        console.error(err);
      });

      // broadcast chat message to all connected clients
      io.emit('chat message', msg);
    });

    // handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}