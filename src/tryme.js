function Person(name) {
    this.name = name;
}
Person.prototype.greet = function greet() {
    return 'Hello ' + this.name;
};
var p = new Person('joe');
console.log(p.greet());
console.log("done...");
