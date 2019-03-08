import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:8080/elements/api-v2',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "User DiSkNIlArAAgfMprsChl/TsQSzKndqlVIZls1yiP2VQ=, Organization 6c22e13fd3f68ccea9c6fada7f88d7b8, Element OS8/qiecAEbMdD0UOVbPm9y2KiHUSnc4RWspu6sMkzc="
    }
});

