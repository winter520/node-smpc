function greeter(person: string) {
  return "Hello, " + person;
}

let user = "Jane User";
// let user = 123;

console.log(user)

document.body.innerHTML = greeter(user);