loadScreen(false);
var dt = new Date();

function clalendario(month, year){
    let M = ['Ene','Feb','Mar','Abr','May','Jun',"Jul","Ago","sept","Oct","Nov","Dic"];
    let semana = '<div class="week">'; 
    let m = 0;

    if(month == 13){
        month = 1;
        year++;
    }
    if(month == 0){
        month = 12;
        year--;
    }

    let template = `
    <div class="controler_">
        <img src="img/arrow.svg" onclick="clalendario(${(month-1)},${year})"><h1>${year}</h1><img src="img/arrow.svg" onclick="clalendario(${(month+1)},${year})">
    </div>
    <div class="data months_">
    `;

    let x = daysInMonth(month, year);
    let f = daysInMonth(month-1, year);
    let h = fisrtDay(month, year);
    let todayDay = dt.getDate();
    let todayMonth =(dt.getMonth()+1);
    let todayYear =dt.getFullYear();

    let o = '';
    for (let i = 0; i < 12; i++) {
        if(month == i+1){
            o = 'class="today"';
        }else{
            o = '';
        }
        template += `
            <p ${o} onclick="clalendario(${i+1},${year})"">${M[i]}</p>
        `;
    }

    template += `
    </div>
    <div class="week days">
        <div class="day">
            <h1>LUN</h1>
        </div>
        <div class="day">
            <h1>MAR</h1>
        </div>
        <div class="day">
            <h1>MIE</h1>
        </div>
        <div class="day">
            <h1>JUE</h1>
        </div>
        <div class="day">
            <h1>VIE</h1>
        </div>
        <div class="day">
            <h1>SAB</h1>
        </div>
        <div class="day">
            <h1>DOM</h1>
        </div>
    </div>
    `
    $('.month').html(template);

    if (h == 0){
        h = 7;
    }

    for(let i = 1; i <= x; i++){
        if(h > 1){
            semana += dayBox(f-(h-2),'x');
            h--;
            if(h == 1){
                i = 0;
            }
        }else{
            if(i <= x){
                if(i == todayDay && month == todayMonth && year == todayYear){
                    semana += dayBox(i,false);
                }else{
                    semana += dayBox(i);
                }
            }
        }
        if(m == 6){
            semana += '</div>';
            $('.month').append(semana);
            semana = '<div class="week">';
            m = -1;
        }else if(i == x){
            for (let r = 0; r < (6-m); r++) {
                semana += dayBox((r+1),true);
            }

            semana += '</div>';
            $('.month').append(semana);
            semana = '<div class="week">';
            m = -1;
        }
        m++;
    };    

    $('#motnhName').html(`<h1>${M[month-1]}</h1>`);
    $('#img1').html(`<img src="arrow.svg" style="transform: rotate(180deg)" onclick="clalendario(${(month-1)},${year})">`);
    $('#img2').html(`<img src="arrow.svg"  onclick="clalendario(${(month-1)},${year})">`);

    function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }
    
    function fisrtDay(month, year){
        return new Date(year + "-" + month + "-01").getDay();
    }

    function dayBox(e,t){
        let g = '';
        j = '';
        if(t == true){
            g = 'outOfMonth';
            j = `onclick="clalendario(${(month+1)},${year})"`;
        }else if(t == false){
            g = 'today';
        }else if(t == 'x'){
            g = 'outOfMonth';
            j = `onclick="clalendario(${(month-1)},${year})"`;
        }
        return `
        <div class="day ${g}" ${j}>
            <div  class="number">${e}</div>
            <div class="rutinas"></div>
        </div>
        `
    }
}




/* Start here */

clalendario(8, 2021);
