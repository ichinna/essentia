var Foo = /** @class */ (function () {
    function Foo() {
    }
    Foo.prototype.getFullName = function () {
        return this.firstName + " " + this.lastName;
    };
    return Foo;
}());
var aPerson = new Foo();
aPerson.firstName = "Chinna";
aPerson.lastName = "Sadam";
console.log(aPerson.getFullName());
var someObj = {
    firstName: "Chello",
    getFullName: function () { return "TEST"; }
};
aPerson = someObj;
console.log(aPerson.getFullName());
