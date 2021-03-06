const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;
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

app.get('/download', (req, res) => {
  res.sendFile(__dirname + '/data/calendario.json');
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
    let [d, p, c] = data; // rut = id // d = dia
    let x = DS;
    DS = DS[c].set;
    console.log(d, p);
    DS[p].splice(d, 1);


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

  socket.on('client:get_muscles', () => {
    let M = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/musculos.json')));
    io.emit('server:musculos', M[0]);

  });

  socket.on('client:save_rutina', data => {
    let R = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/rutinas.json')));
    data.id = (R.length)+1;
    console.log(data.titulo);

    if(data.titulo == ''){
      data.titulo = 'unnamed';
    }
    if(data.link == ''){
      data.link = 'unlinked';
    }
    if(data.musculos.length == 0){
      data.musculos.push('tren_superior');
    }
    R.push(data);
    fs.writeFileSync(path.resolve(__dirname, 'data/rutinas.json'), JSON.stringify(R));
    io.emit('server:RutinasIndex', R);
  });

  socket.on('client:deleteRutineSet', data => {
    let R = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/rutinas.json')));
    let DS = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/diarioSemanal.json')));
    let C = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/calendario.json')));

    const found = R.findIndex(element => element.id == data);
    R.splice(found, 1);
    for(let i = 1; i < DS.length; i++){
      for(let j = 0; j < DS[i].set.length; j++){
        const found = DS[i].set[j].findIndex(element => element == data);
        if(found != -1){
          DS[i].set[j].splice(found, 1);
        }
      }
    }

    for (let i = 0; i < C.length; i++) {
      for (let j = 0; j < C[i].length; j++) {
        for (let g = 0; g < C[i].month.length; g++) {
          for (let t = 0; t < C[i].month[g].length; t++) {
            for (let v = 0; v < C[i].month[g].rutinas.length; v++) {
              const found = C[i].month[g].rutinas.findIndex(element => element == data);
              if(found != -1){
                C[i].month[g].rutinas.splice(found, 1);
              }
              console.log(data);
            }
          }
        }
      }
    }

    fs.writeFileSync(path.resolve(__dirname, 'data/rutinas.json'), JSON.stringify(R));
    fs.writeFileSync(path.resolve(__dirname, 'data/diarioSemanal.json'), JSON.stringify(DS));
    fs.writeFileSync(path.resolve(__dirname, 'data/calendario.json'), JSON.stringify(C));
    io.emit('server:RutinasIndex', R);
    

  });
 
  socket.on('client:save_edit_rutina', data =>{
    let R = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/rutinas.json')));
    const found = R.findIndex(element => element.id == data.id);
    R[found] = data;
    fs.writeFileSync(path.resolve(__dirname, 'data/rutinas.json'), JSON.stringify(R));
    io.emit('server:RutinasIndex', R);
  });

  socket.on('client:get_calendario', () =>{
    let C = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/calendario.json')));
    io.emit('server:calendario', C);

  });

  socket.on('client:save_rutina_to_calendar', data =>{
    let C = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/calendario.json')));
    let foundYear = C.findIndex(element => element.year == data.year);
    if(foundYear != -1){
        //A??o si existe
      let foundDay = C[foundYear].month[data.month].findIndex(element => element.dia == data.day);
      if(foundDay != -1){
        //D??a existe
        C[foundYear].month[data.month][foundDay].rutinas.push(data.id);
      }else{
        //D??a no existe
        C[foundYear].month[data.month].push({
          dia: data.day,
          rutinas: [
              data.id
          ]
        });
      }
    }else{
      //A??o no existe
      C.push({
        year: data.year,
        month: [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ]
      });
      let foundYear = C.findIndex(element => element.year == data.year);
      C[foundYear].month[data.month].push({
        dia: data.day,
        rutinas: [
            data.id
        ]
      });
    }

   
    
    fs.writeFileSync(path.resolve(__dirname, 'data/calendario.json'), JSON.stringify(C));
    io.emit('server:workout_saved',);

  })
});
// Server
http.listen(port, () => {
  console.log(`server running at http://localhost:${port}/`);
});

// Functions

/* {
  "dia": "3",
  "rutinas": [
      8
  ]
}

{
  "year": "2023",
  "month": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
  ]
} */