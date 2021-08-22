var socket = io();
loadScreen(true);
socket.emit('client:get_Rutinas+Horario');

const dias = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado',];
var Rutines_ = '';

socket.on('server:Rutinas', function(data){
    let [DS, R] = data;
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
    
    loadScreen(false);
    $('.grid').html(template);

})

socket.on('server:restart_rutines', () =>{
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
            <div class="r__delete" ><img onclick="deleteRutine(${result[0].id},${d})" src="img/remove.svg"></div>
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
    socket.emit('client:deleteRutineDay', [e,x]);
    $('.___delete').css('display','none');
}

function addRutine(d){
    let template = `
    <div class="r__clicktohidde" onclick=" $('.___delete').css('display','none')" ></div>
    <div  class="r__add_box__">
       <div class="r__inp">
            <h1>Añadir rutina</h1>
            <select value="">
                ${addRutineOption()}
            </select>
       </div>
    

        <div class="r__btn_">
            <button class="r__btn btn-si" onclick="$('.___delete').css('display','none')"">Cancelar</button>
            <button class="r__btn btn-no">Añadir</button>
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
            <option>${e[i].titulo}</option>
        `;
    }
    return template;
}