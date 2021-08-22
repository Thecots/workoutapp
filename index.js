console.clear();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;
const fs = require('fs');
const path = require('path');
const date = new Date()

// REMEMBER!!! Saco de BOEXEO!!

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
    DS = DS[DS[0]].set;
    for (let i = 0; i < DS[(date.getDay())].length; i++) {
      let result = R.filter(rutina => {
        return rutina.id == DS[(date.getDay())][i];
      })
      if(result[0] != undefined){
        finalSend.push(result[0]);
      }
    }
    io.emit('server:Diario_Semanal', finalSend);
  });

  socket.on('client:get_Rutinas', () => {
    let R = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/rutinas.json')));
    io.emit('server:RutinasIndex', R);
  });
  
  socket.on('client:get_Rutinas+Horario', () => {
    let DS = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/diarioSemanal.json')));
    let R = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/rutinas.json')));
    
    io.emit('server:Rutinas', [DS[DS[0]],R,DS]);
  });

  socket.on('client:deleteRutineDay', data =>{
    let DS = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/diarioSemanal.json')));
    let [rut,d, p] = data;
    let x = DS;
    DS = DS[p].set
    let result = DS[d].indexOf(rut);
    DS[d].splice(result, 1);
    fs.writeFileSync(path.resolve(__dirname, 'data/diarioSemanal.json'), JSON.stringify(x));
    io.emit('server:restart_rutines');  
  });

  socket.on('client:addRutineDay', data =>{
    let DS = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/diarioSemanal.json')));
    let [r,d, p] = data;
    let x = DS;
    DS = DS[p].set;
    DS[d].push(r);
    fs.writeFileSync(path.resolve(__dirname, 'data/diarioSemanal.json'), JSON.stringify(x));
    io.emit('server:restart_rutines');
  })

  socket.on('client:changeSet', data => {
    let DS = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/diarioSemanal.json')));
    DS[0] = data;
    fs.writeFileSync(path.resolve(__dirname, 'data/diarioSemanal.json'), JSON.stringify(DS));
    io.emit('server:restart_rutines');
  });

  socket.on('client:newSet', data => {
    let DS = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/diarioSemanal.json')));
    let x = DS;
    DS.push({"setid":DS.length,"setname":data,"set":[[],[],[],[],[],[],[]]});
    DS[0] = DS.length-1;
    fs.writeFileSync(path.resolve(__dirname, 'data/diarioSemanal.json'), JSON.stringify(x));
    io.emit('server:restart_rutines');
  });

  socket.on('client:deleteSet', data => {
    let DS = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/diarioSemanal.json')));
    console.log();
    if(DS.length > 2){
      DS.splice(data, 1);
      DS[0] = DS.length-1;
      for (let i = 1; i < DS.length; i++) {
        DS[i].setid = i;
      }
      fs.writeFileSync(path.resolve(__dirname, 'data/diarioSemanal.json'), JSON.stringify(DS));
      io.emit('server:restart_rutines');
    }else{
      io.emit('server:errorDeleteTest');
    }


  });
});
// Server
http.listen(port, () => {
  console.log(`server running at http://localhost:${port}/`);
});

// Functions

