//* declared libs, settings, and pre-route middleware (middleware happens in the order they are defined)
require("dotenv").config(); // Loads .env file contents into process.env by default
const express = require("express");
const app = express();
app.use(express.json()); // this is a 'Express json-parser' middleware that parses incoming requests with JSON payloads
const cors = require("cors"); // https://github.com/expressjs/cors (needs: npm install cors)
app.use(cors()); // this is a 'cors' middleware that allows requests from other origins
var morgan = require("morgan"); // https://github.com/expressjs/morgan (needs: npm install morgan)
morgan.token("content", function (req, res) {
  return JSON.stringify(req.body);
}); // custom token to log the body of the request
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);
// example output: POST /api/persons 200 58 - 4.794 ms {"name":"sample Name","number":"123-4458"}
app.use(express.static("dist")); // this is a 'static' middleware that serves static files from the 'dist' folder, ref: https://fullstackopen.com/en/part3/deploying_app_to_internet#serving-static-files-from-the-backend
const mongoose = require("mongoose");
const Person = require("./models/person");


//* starter data (and 'persons' hold server's 'live' data state [not the actual db])
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

//* routes
app.get("/hello", (request, response) => {
  response.send("<h1>Hello World!</h1>");
}); //   http://localhost:3001/hello

app.get("/api/persons", (request, response) => {
  // response.json(persons);
  Person.find({}).then((result) => {
    response.json(result);
  });
}); //   http://localhost:3001/api/persons

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((item) => {
      if (item) {
        response.json(item);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});
// http://localhost:3001/api/persons/66e4d4c87984387b834fe42a "jujujjjuju" example
// http://localhost:3001/api/persons/66e4d4c87900000000000000 for fail 404 example
// http://localhost:3001/api/persons/66e4d4c879 for fail 400 example {"error":"malformatted id"}

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
}); // check requests/update***.rest files for testing

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
}); // check requests/delete***.rest files for testing

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name and/or number missing",
    });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then((result) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    // mongoose.connection.close(); //should i remove this, or will my db on the server be unnecessarily open all the time?
  });
  // persons = persons.concat(entry);
  response.json(person);
}); // check requests/create***.rest files for testing

// use ` to write cleaner structured html code
app.get("/api/info", (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      const date = new Date();
      response.send(`
        <h1>Phonebook has info for ${count} people</h1>
        <br/>
        <h2>${date}</h2>
        `);
    })
    .catch((error) => next(error));
}); //   http://localhost:3001/api/info

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//* after-route middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint); // this is a custom middleware that handles unknown routes
// below is the custom middleware that handles errors (from routes with 'next' function)...
// can test with http://localhost:3001/api/persons/66e4d4c879 for fail 400 example {"error":"malformatted id"}
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};
app.use(errorHandler); // this has to be the last loaded middleware, also all the routes should be registered before this!
