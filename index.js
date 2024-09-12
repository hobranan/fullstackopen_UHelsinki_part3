const express = require("express");
const app = express();
app.use(express.json()); // this is a middleware that parses incoming requests with JSON payloads

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

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const entry = persons.find((item) => item.id === id);
  if (entry) {
    response.json(entry);
  } else {
    response.status(404).end();
  }
}); //   http://localhost:3001/api/persons/1 for example
//   http://localhost:3001/api/persons/10 for fail 404 example

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((item) => item.id !== id);

  response.status(204).end(); // this is also the response for nonexistent 404 for this learning exercise
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name and/or number missing",
    });
  }
  const generateId = () => {
    return Math.floor(Math.random() * 4294967295);
  };
  let random_id = generateId();
  console.log(random_id);
  while (persons.find((item) => item.id === random_id)) {
    random_id = generateId();
    console.log(random_id);
  }
  const entry = {
    name: body.name,
    number: body.number,
    id: random_id,
  };
  persons = persons.concat(entry);
  response.json(entry);
});

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
