const fs = require('fs');
const path = require('path');

let dayWork = [
    [
        {
            id: 'xxxxx-xxxxx-xxxx',
            title: [1,2,3,44]
        }
    ],
    [
        {
            id: 'xxxxx-xxxxx-xxxx',
            title: 'bicep'
        }
    ],
    [
        {
            id: 'xxxxx-xxxxx-xxxx',
            title: 'antebrazo'
        }
    ],
    [
        {
            id: 'xxxxx-xxxxx-xxxx',
            title: 'tricep y espalda'
        }
    ],
    [
        {
            id: 'xxxxx-xxxxx-xxxx',
            title: 'antebrazo'
        },
        {
            id: 'xxxxx-xxxxx-xxxx',
            title: 'pecho y hombro'
        }
    ],
    [
        {
            id: 'xxxxx-xxxxx-xxxx',
            title: 'pecho y hombro'
        }
    ],
    [
        {
            id: 'xxxxx-xxxxx-xxxx',
            title: ''
        }
    ]

];
 
fs.writeFileSync(path.resolve(__dirname, 'calendarioRutina.json'), JSON.stringify(dayWork));
