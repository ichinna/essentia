import { Person } from './classes';

function echo<T>(arg: T): T {
    return arg;
}

var myStr: number = echo(1);



class Admin extends Person {

}

class Manager extends Person {

}

let admin = new Admin("a", "a");
let manager = new Manager("m", "m");

function personEcho<T>(person: T): T {
    return person;
}

var foo = personEcho(admin);
var bar = personEcho(manager);
