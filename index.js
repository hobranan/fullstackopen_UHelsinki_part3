const express = require("express");
const app = express();

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: "5",
    name: "Bary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
}); //   http://localhost:3001/

app.get("/api/persons", (request, response) => {
  response.json(persons);
}); //   http://localhost:3001/api/persons

// use ` to write cleaner structured html code
app.get("/api/info", (request, response) => {
  const amount_people = persons.length;
  const date = new Date();
  response.send(`
    <h1>Phonebook has info for ${amount_people} people</h1>
    <br/>
    <h2>${date}</h2>
    `);
}); //   http://localhost:3001/api/info

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
