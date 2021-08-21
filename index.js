console.clear();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8800;
const fs = require('fs');
const path = require('path');
const date = new Date()



// Routes
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/calendario', (req, res) => {
  res.sendFile(__dirname + '/public/calendario.html');
});

app.get('/watch', (req, res) => {
  res.sendFile(__dirname + '/public/watch.html');
});

app.get('/rutinas', (req, res) => {
  res.sendFile(__dirname + '/public/rutinas.html');
});

// Socket
io.on('connection', (socket) => {
  console.log(`connection form id:${socket.id}`);
  
  
  socket.on('client:get_Diario_Semanal', () => {
    let DS = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/diarioSemanal.json')));
    let R = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/rutinas.json')));
    let finalSend = []
    for (let i = 0; i < DS[(date.getDay()-1)].length; i++) {
      let result = R.filter(rutina => {
        return rutina.id == DS[(date.getDay()-1)][i];
      })
      if(result[0] != undefined){
        finalSend.push(result[0]);
      }
    }
    io.emit('server:Diario_Semanal', finalSend);
  });

  socket.on('client:get_Rutinas', () => {
    let R = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/rutinas.json')));
    io.emit('server:Rutinas', R);
  });
  
  socket.on('client:get_Rutinas+Horario', () => {
    let DS = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/diarioSemanal.json')));
    let R = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/rutinas.json')));
    io.emit('server:Rutinas', [DS,R]);
  });

});
// Server
http.listen(port, () => {
  console.log(`server running at http://localhost:${port}/`);
});

// Functions

