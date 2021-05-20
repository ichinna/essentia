const F = require('fluture');
const { pipe, curry } = require('ramda');
const {invoker} = require('ramda');
const {EventEmitter} = require('events');

const emit = invoker(1, 'emit');


const test = curry((input, input2) => F.go(function* () {

    let eventEmitter = new EventEmitter();

    let i = 0;

    while (i < 10) {

        if (i == 5) {
            throw new Error("Thrwing error when i is 5");
        }
        console.log('running for' + i);

        i++;

        
    }


    return "done";


}));


const run = async () => {
    console.log("run");

    let res = await pipe(
        test('test'),
        F.promise
    )("2arg");
    
    console.log(res);
}

run();