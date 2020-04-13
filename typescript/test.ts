class Person {
    firstName: string;
    lastName: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    getFullName() {
        return this.firstName + " " + this.lastName;
    }

    greet() {
        console.log("Hey there!");
    }
}


class Programmer extends Person {

    greet() {
        console.log("Hello world!")
    }

    greetLikeNormalPeoper() {
        super.greet();
    }

}

var aProgrammer = new Programmer("Java", "TS");
aProgrammer.greet();
aProgrammer.greetLikeNormalPeoper();