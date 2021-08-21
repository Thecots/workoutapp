var socket = io();
loadScreen(true);
socket.emit('client:get_Rutinas+Horario');


socket.on('server:Rutinas', function(data){
    let dias = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
    let [DS, R] = data;
    let template = '';

    for (let i = 0; i < DS.length; i++) {
       template += `
            <div class="r_div">
                <div class="r__day">${dias[i]}</div>
                <div class="__div">
                    ${getDayWorks(DS[i],R)}
                </div>
            </div>
        `;
        
    }
    
    loadScreen(false);
    $('.grid').append(template);

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

function getDayWorks(e,x){
    let template = '<div class="r__work_box">';
    for (let i = 0; i < e.length; i++) {
        let result = x.filter(rutina => {
            return rutina.id == e[i];
        });

        template += `
        <div class="r__rutina_box">
            <div class="r__delete" ><img onclick() src="img/remove.svg"></div>
            <div class="r__p"><p>${result[0].titulo}</p></div>
            
            <div class="img__muscles">
                ${musclesImg(result[0].musculos)}
            </div>
        </div>
        `;
    }
    return template += `</div>
        <div class="add_workout">
            <img src="img/more.svg">
        </div>
    `;
}

