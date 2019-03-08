const cron = require('node-cron');
const axios = require('axios') ;//'axios';

const elementsApi = axios.create({
    baseURL: 'http://localhost:8080/elements/api-v2',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "User DiSkNIlArAAgfMprsChl/TsQSzKndqlVIZls1yiP2VQ=, Organization 6c22e13fd3f68ccea9c6fada7f88d7b8, Element OS8/qiecAEbMdD0UOVbPm9y2KiHUSnc4RWspu6sMkzc="
    }
});
// const elementsApi = axios.create({
//     baseURL: 'https://snapshot.cloud-elements.com/elements/api-v2',
//     headers: {
//         "Content-Type": "application/json",
//         "Accept": "application/json",
//         "Authorization": "User c9/mG8vWV1PpGNAIwRifa1x2zLU19b1x/IQklDn/GNg=, Organization d7a21a490c6e0956af286a4d825cd8c2, Element MuQV5LlU4EvbF/7/+9S6D840nprInoMIMs2enF3xyXI="
//     }
// });

let i = 0;
hitApi = async (pageSize) => {
    let now = new Date().getTime();
    const response = await elementsApi.get('/accounts', {
        params: { 
            pageSize: pageSize,
            returnTotalCount: true
         }
    });
    if (response.status === 200) {
        let id = response.headers['elements-request-id'];
        console.log(`${new Date().getTime() - now} - ${id}`);
        i++;
    }
    if (i === 10) {
        task.destroy();
    }
}

var task = cron.schedule('*/15 * * * * *', () => {
    hitApi(1000);
});

task.start();

