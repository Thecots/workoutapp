var socket = io();
loadScreen(true);
socket.emit('client:get_Rutinas+Horario');

const dias = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado',];
var Rutines_ = '';
var currentSet = '';

socket.on('server:Rutinas', function(data){
    let [DS, R, totalSets] = data;
    DS = DS.set;
    currentSet = totalSets[0];
    let template = '';
    Rutines_ = R;
    for (let i = 0; i < DS.length; i++) {
       template += `
            <div class="r_div">
                <div class="r__day">${dias[i]}</div>
                <div class="__div">
                    ${getDayWorks(DS[i],R,i)}
                </div>
            </div>
        `;
        
    }
    loadSelectedSet(totalSets);
    loadScreen(false);
    $('.grid').html(template);

})

socket.on('server:restart_rutines', () =>{
    loadScreen(true);
    socket.emit('client:get_Rutinas+Horario');
})

// Functions

function musclesImg(e){
    let template = '';
    for (let i = 0; i < e.length; i++) {
        template += `
            <img src="img/muscles/${e[i]}.png">
        `
    }
    return template;
}

function getDayWorks(e,x,d){
    let template = '<div class="r__work_box">';
    for (let i = 0; i < e.length; i++) {
        let result = x.filter(rutina => {
            return rutina.id == e[i];
        });
        template += `
        <div class="r__rutina_box">
            <div class="r__delete" ><img onclick="deleteRutine(${i},${d})" src="img/remove.svg"></div>
            <div class="r__p"><p>${result[0].titulo}</p></div>
            
            <div class="img__muscles">
                ${musclesImg(result[0].musculos)}
            </div>
        </div>
        `;
    }
    return template += `</div>
        <div class="add_workout">
            <img onclick="addRutine(${d})" src="img/more.svg">
        </div>
    `;
}

function deleteRutine(e,d){
    let template = `
    <div class="r__clicktohidde" onclick=" $('.___delete').css('display','none')" ></div>
    <div  class="r__delete_box__">
        <div>
            <img id="r__" src="img/peligro.svg">
            <p>Deseas eliminar</p>
        </div>
        <div>
            <button type="button" class="r__btn btn-si" onclick="deleteConfirmedRutine(${e},${d})">Si</button>
            <button type="button" class="r__btn btn-no" onclick=" $('.___delete').css('display','none')">No</button>

        </div>
    </div>
    `;
    $('.___delete').html(template);
    $('.___delete').css('display','flex');
}



function deleteConfirmedRutine(e,x){
    socket.emit('client:deleteRutineDay', [e,x,currentSet]);
    $('.___delete').css('display','none');
}

function addRutine(d){
    let template = `
    <div class="r__clicktohidde" onclick=" $('.___delete').css('display','none')" ></div>
    <div  class="r__add_box__">
       <div class="r__inp">
            <h1>A??adir rutina</h1>
            <select id="select_id">
                <option hidden selected>Selecciona una rutina</option>
                ${addRutineOption()}
            </select>
       </div>
    

        <div class="r__btn_">
            <button class="r__btn btn-si" onclick="$('.___delete').css('display','none')">Cancelar</button>
            <button class="r__btn btn-no" onclick="addConfirmedRutine(${d})">A??adir</button>
       </div>
    </div>
    `;
    $('.___delete').html(template);
    $('.___delete').css('display','flex');
}

function addRutineOption() {
    let e = Rutines_;
    template = '';
    for(let i = 0; i < e.length; i++){
        template += `
            <option value="${e[i].id}">${e[i].titulo}</option>
        `;
    }
    return template;
}

function addConfirmedRutine(d){
    let x = $('#select_id').val();
    if(x > 0){
        socket.emit('client:addRutineDay', [x,d,currentSet]);   
        $('.___delete').css('display','none');  
    }
}

var optBtn = false;
function options(){
    if(optBtn != true){
        optBtn = true;
        $('.r__options_btn img').css('transform','rotate(90deg)');
        $('.r__options_box').css('display','flex');
    }else{
        optBtn = false;
        $('.r__options_btn img').css('transform','rotate(0deg)');
        $('.r__options_box').css('display','none');
    }
}

function loadSelectedSet(e){
    let template = '';
    let j = ''
    for (let i = 1; i < e.length; i++) {
        if(e[0] != e[i].setid){
            template += `
            <option value="${e[i].setid}"}>${e[i].setname}</option>
        `
        }else{
            template += `
            <option selected value="${e[i].setid}">${e[i].setname}</option>
        `  
        }
             
    }


    $('#setsselect').html(template);
}

function changeSet(){
    let e = $('#setsselect').val();
    if( e != currentSet){
        socket.emit('client:changeSet', e);   
    }
}


function newSet(){
    let template = `
    <div class="r__clicktohidde" onclick=" $('.___delete').css('display','none')" ></div>
    <div  class="r__add_box__">
       <div class="r__inp">
            <h1>Nuevo set</h1>
            <input id="newSetName" placeholder="Set name"></input>
       </div>
    

        <div class="r__btn_">
            <button class="r__btn btn-si" onclick="$('.___delete').css('display','none')">Cancelar</button>
            <button class="r__btn btn-no" onclick="confirmNewSet()">A??adir</button>
       </div>
    </div>
    `;
    $('.___delete').html(template);
    $('.___delete').css('display','flex');
}

function confirmNewSet(){
    $('.___delete').css('display','none');
    let e = $('#newSetName').val();
    if(e == ''){
        e = 'unnamed'
    }
    socket.emit('client:newSet',e); 
};

function borrarSet(){
    let template = `
    <div class="r__clicktohidde" onclick=" $('.___delete').css('display','none')" ></div>
    <div  class="r__delete_box__">
        <div>
            <img id="r__" src="img/peligro.svg">
            <p>Deseas eliminar</p>
        </div>
        <div>
            <button type="button" class="r__btn btn-si" onclick="confirmDeleteSet(${currentSet})">Si</button>
            <button type="button" class="r__btn btn-no" onclick=" $('.___delete').css('display','none')">No</button>

        </div>
    </div>
    `;
    $('.___delete').html(template);
    $('.___delete').css('display','flex');
}

function confirmDeleteSet(e){
    $('.___delete').css('display','none');
    socket.emit('client:deleteSet',e); 
}