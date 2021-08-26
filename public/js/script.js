var socket = io();
loadScreen(false);
socket.emit('client:get_Diario_Semanal');
socket.emit('client:get_Rutinas');
socket.emit('client:get_muscles');
var M = '';
var RUT = '';
socket.on('server:musculos', function(data){
    M = data;
});

socket.on('server:Diario_Semanal', function(data) {
    let template = `
        <p>Rutinas de hoy: ${dayWork(data)}</p>
        <img onclick="window.location.href='/rutinas'" src="img/conf.svg">
    `;
    $('#alert-box-configure').html('');
    $('#alert-box-configure').append(template);
});

socket.on('server:RutinasIndex', function(data){
    socket.emit('client:get_Diario_Semanal');
    let template = '';
    RUT = data;
    for (let i = 0; i < data.length; i++) {
        let x = data[i].link.replace('https://www.youtube.com/watch?v=','');
        
        template += `
        <div  class="i__video_box" id="i__video_box">
            <div class="x_click inv_box_x" onclick="video('${x}',${data[i].id})"></div>
            <div class="x_delete inv_box_x" onclick="deleteRutineSet(${data[i].id})"><img src="img/remove.svg"></div>
            <div class="x_edit inv_box_x" onclick="editRutineSet(${i})"><img src="img/editar.svg"></div>
            <p>${data[i].titulo}</p>
            <hr>
            <div class="img__muscles">
                ${musclesImg(data[i].musculos)}
            </div>
        </div>
    `
    }
    $('.grid').html(template);

})

/* Functions */

function dayWork(e){
    if(e[0] != undefined){
        let r = '';
        for (let i = 0; i < e.length; i++) {
            let x = e[i].link.replace('https://www.youtube.com/watch?v=','')
            if(e.length > 1){
                if(i < (e.length-1)){
                    r += `
                    <a onclick="window.location.href = '/watch?id=${e[i].id}&v=${x}' ">${e[i].titulo}</a> - 
                `
                }else{
                    r += `
                    <a onclick="window.location.href = '/watch?id=${e[i].id}&v=${x}' ">${e[i].titulo}</a>
                    `
                }
            }else{
                r += `
                    <a onclick="window.location.href = '/watch?id=${e[i].id}&v=${x}' ">${e[i].titulo}</a>
                `
            }
    
        }
        return r;
    }else{
        return '<a style="text-decoration: none; cursor: none;">No hay nada para hoy</a>'
    }
   
}

function musclesImg(e){
    let template = '';
    for (let i = 0; i < e.length; i++) {
        template += `
            <img src="img/muscles/${e[i]}.png">
        `
    }
    return template;
}

function video(e,l){
    window.location.href = `/watch?id=${l}&v=${e}`;

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

function newset(){
    $('.x_edit').css('display','none');
    $('.x_delete').css('display','none');
    xedit = false;
    xdelete = false;


    let template = `
    <div class="r__clicktohidde" onclick=" $('.___delete').css('display','none')" ></div>
    <div  class="r__delete_box__index">
        <h1>Nueva rutina</h1>
        <div class="s__inputs">
            <p>Nombre</p>
            <input type="text" id="s_name" placeholder="bicep 1">

            <p>Link</p>
            <input type="text" id="s_video" placeholder="https://www.youtube.com/watch?v=yeoo2LOU1V0">

            <p>Musculos</p>
            <div class="sm_muscles_box">
                <form id="form_check_muscles">
                    ${getmuscles()}
                </form>
            </diV>
            <div class="sm_m_s__">
                <button type="button" class="r__btn btn-si" onclick=" $('.___delete').css('display','none')">Cancelar</button>
                <button class="r__btn btn-no" onclick="getFormCheck()">Crear</button>
            </div>
               
        </div>
    </div>
    `;
    $('.___delete').html(template);
    $('.___delete').css('display','flex');
}


function getmuscles(){
    let template = '';
    for (let i = 0; i < M.length; i++) {
        template += `
        <label id="${M[i]}" style = "text-transform:capitalize">
            <input type="checkbox" name="checkForm" value="${M[i]}"> ${M[i]} <img src="img/muscles/${M[i]}.png">
        </label>
        `
    }
    return template;
}

var chbd = false;
function openCheckMenu(){
    if(chbd == false){
        $('.sm_muscles_box').css('display','block');
        chbd = true;
    }else{
        $('.sm_muscles_box').css('display','none');
        chbd = false;
    }

}



function getFormCheck(){
    let Muscles = [];
    var markedCheckbox = document.getElementsByName('checkForm');
    for (var checkbox of markedCheckbox) {
      if (checkbox.checked)
        Muscles.push(checkbox.value);
    }
    
    let x = {
        id: '',
        titulo:$('#s_name').val(),
        musculos: Muscles,
        link:$('#s_video').val()
    };
    socket.emit('client:save_rutina', x);
    $('.___delete').css('display','none');
}

var xdelete = true;
var xedit = true;

function deleteSet(){
    if($('.x_edit').css('display') == 'flex'){
        $('.x_edit').css('display','none');
    }
    if($('.x_delete').css('display') == 'none'){
        $('.x_delete').css('display','flex');
    }else{
        $('.x_delete').css('display','none');
    }

}

function editSet(){
    if($('.x_delete').css('display') == 'flex'){
        $('.x_delete').css('display','none');
    }
    if($('.x_edit').css('display') == 'none'){
        $('.x_edit').css('display','flex');
    }else{
        $('.x_edit').css('display','none');
    }
}

function deleteRutineSet(e){
    socket.emit('client:deleteRutineSet', e);
    $('.x_delete').css('display','flex');

}

function editRutineSet(e){
    $('.x_edit').css('display','none');
    $('.x_delete').css('display','none');
    xedit = false;
    xdelete = false;

    e = RUT[e];
    let template = `
    <div class="r__clicktohidde" onclick=" $('.___delete').css('display','none')" ></div>
    <div  class="r__delete_box__index">
        <h1>Nueva rutina</h1>
        <div class="s__inputs">
            <p>Nombre</p>
            <input type="text" id="s_name" placeholder="bicep 1" value="${e.titulo}">

            <p>Link</p>
            <input type="text" id="s_video" placeholder="https://www.youtube.com/watch?v=yeoo2LOU1V0" value="${e.link}">

            <p>Musculos</p>
            <div class="sm_muscles_box">
                <form id="form_check_muscles">
                    ${getmusclesEdit(e.musculos)}
                </form>
            </diV>
            <div class="sm_m_s__">
                <button type="button" class="r__btn btn-si" onclick=" $('.___delete').css('display','none')">Cancelar</button>
                <button class="r__btn btn-no" onclick="saveEditRutine(${e.id})">Guardar</button>
            </div>
               
        </div>
    </div>
    `;
    $('.___delete').html(template);
    $('.___delete').css('display','flex');
}

function getmusclesEdit(e){
    let template = '';
    for (let i = 0; i < M.length; i++) {
        let x = '';
        const found = e.findIndex(element => element == M[i]);
        if(found != -1){
            x =  "checked";
        };

        template += `
        <label id="${M[i]}" style = "text-transform:capitalize">
            <input type="checkbox" ${x} name="checkForm" value="${M[i]}"> ${M[i]} <img src="img/muscles/${M[i]}.png">
        </label>
        `
    }
    return template;
}

function saveEditRutine(e){
    let Muscles = [];
    var markedCheckbox = document.getElementsByName('checkForm');
    for (var checkbox of markedCheckbox) {
      if (checkbox.checked)
        Muscles.push(checkbox.value);
    }
    
    let x = {
        id: e,
        titulo:$('#s_name').val(),
        musculos: Muscles,
        link:$('#s_video').val()
    };
    console.log(x);
    socket.emit('client:save_edit_rutina', x);
    $('.___delete').css('display','none');
}