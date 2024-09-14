require("dotenv").config(); // Loads .env file contents into process.env by default
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI; // MONGODB_URI="mongodb+srv://fullstack:password@db.gwcmebp.mongodb.net/?retryWrites=true&w=majority&appName=db"
console.log("connecting to", url);
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (error) => {
  console.log("error connecting to MongoDB:", error.message);
});
db.once("open", () => {
  console.log("connected to MongoDB");
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // converts mongoDB's '_id' to our '.id'
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);

// name of the collection is 'people' (from 'Person' model)
// In the Person model definition, the first "Person" parameter is the singular name of the model.
// The name of the collection will be the lowercase plural people, because the Mongoose convention
// is to automatically name collections as the plural (e.g. people)
// when the schema refers to them in the singular (e.g. Person).
