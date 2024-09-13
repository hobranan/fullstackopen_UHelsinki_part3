const express = require("express");
const app = express();
// middleware happens in the order they are defined
app.use(express.json()); // this is a 'Express json-parser' middleware that parses incoming requests with JSON payloads

const cors = require("cors"); // https://github.com/expressjs/cors (needs: npm install cors)
app.use(cors()); // this is a 'cors' middleware that allows requests from other origins

var morgan = require("morgan"); // https://github.com/expressjs/morgan (needs: npm install morgan)
// app.use(morgan("tiny")); // this is a 'morgan' middleware that logs the requests to the console
// example output: POST /api/persons 200 58 - 4.724 ms (* see .rest file to use post and detailed response)

morgan.token("content", function (req, res) {
  return JSON.stringify(req.body);
}); // custom token to log the body of the request
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);
// example output: POST /api/persons 200 58 - 4.794 ms {"name":"sample Name","number":"123-4458"}

app.use(express.static('dist')) // this is a 'static' middleware that serves static files from the 'dist' folder, ref: https://fullstackopen.com/en/part3/deploying_app_to_internet#serving-static-files-from-the-backend

// starter data (and 'persons' hold server's data state)
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

app.get("/hello", (request, response) => {
  response.send("<h1>Hello World!</h1>");
}); //   http://localhost:3001/hello

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
  // reference to codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses
  // trying 409 Conflict: This response is sent when a request conflicts with the current state of the server.
  if (persons.find((item) => item.name === body.name)) {
    return response.status(409).json({
      error: "name must be unique, name already exists",
    });
  }
  // const generateId = () => {
  //   return Math.floor(Math.random() * 4294967295);
  // };
  // let random_id = generateId();
  // console.log(random_id);
  // while (persons.find((item) => item.id === random_id)) {
  //   random_id = generateId();
  //   console.log(random_id);
  // }
  const entry = {
    name: body.name,
    number: body.number,
    id: body.id,
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// after-route middleware
// this is a custom middleware that handles unknown routes
// const unknownEndpoint = (request, response, next) => {
//   response.status(404).send({ error: "unknown endpoint" });
// };
// app.use(unknownEndpoint);
