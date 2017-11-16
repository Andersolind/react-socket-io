//Requiree
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
//end requires

const port = process.env.PORT || 4001;
const index = require('./routes/index');
const app = express();
app.use(index);
//Create the server
const server = http.createServer(app);
const io = socketIo(server);

let axios_key =
  'https://api.darksky.net/forecast/7c624759bdaef1196c45419dd4b8cc86/43.7695,11.2558';
io.on('connection', socket => {
  console.log('New client connected'),
    setInterval(() => getApiAndEmit(socket), 10000);
  socket.on('disconnect', () => console.log('Client disconnected'));
});
const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(axios_key);
    socket.emit('FromAPI', res.data.currently.temperature);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};
server.listen(port, () => console.log(`Listening on port ${port}`));
