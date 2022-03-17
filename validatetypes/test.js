const constructError = require('./adjunct/constructError');

// const context = Context({
//     config: { "a": 1 },
//     info: { "a": 1 },
//     steps: { "a": 1 },
//     trigger: { "a": 1 },
//     meta: AmadeusMeta({
//         correlationId: 'cid',
//         workerGroupId: 'wid'
//     })
// });

// console.log(context.meta);
// console.log('shit');


try {
     console.log(a.b);
} catch(e) {
    constructError(e);
}