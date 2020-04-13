interface Person {
    firstName: string;
    lastName: string;
    getFullName(): string;
}

class Foo implements Person {
    firstName: string;
    lastName: string;
    getFullName(): string {
        return this.firstName + " " + this.lastName;
    }
}


var aPerson: Person = new Foo();
aPerson.firstName = "Chinna";
aPerson.lastName = "Sadam";
console.log(aPerson.getFullName());

let someObj = {
    firstName: "Chello",
    lastName: "Mine",
    flag: true,
    getFullName: () => "TEST"
}

aPerson = someObj;
console.log(aPerson.getFullName());
