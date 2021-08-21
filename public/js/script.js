var socket = io();
loadScreen(false);
socket.emit('client:get_Diario_Semanal');
socket.emit('client:get_Rutinas');

socket.on('server:Diario_Semanal', function(data) {
    let template = `
        <p>Rutinas de hoy: ${dayWork(data)}</p>
        <img onclick="window.location.href='/rutinas'" src="img/conf.svg">
    `;
    $('.alert-box').html('');
    $('.alert-box').append(template);
});

socket.on('server:Rutinas', function(data){
    let template = '';
    for (let i = 0; i < data.length; i++) {
        let x = data[i].link.replace('https://www.youtube.com/watch?v=','');
        
        template += `
        <div onclick="video('${x}')" class="i__video_box">
            <p>${data[i].titulo}</p>
            <hr>
            <div class="img__muscles">
                ${musclesImg(data[i].musculos)}
            </div>
        </div>
    `
    }
    $('.grid').append(template);

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
                    <a onclick="window.location.href = '/watch?v=${x}'">${e[i].titulo}</a> - 
                `
                }else{
                    r += `
                    <a onclick="window.location.href = '/watch?v=${x}'">${e[i].titulo}</a>
                    `
                }
            }else{
                r += `
                    <a onclick="window.location.href = '/watch?v=${x}'">${e[i].titulo}</a>
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

function video(e){
    window.location.href = "/watch?v="+e;

}