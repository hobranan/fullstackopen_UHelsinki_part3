require("dotenv").config(); // Loads .env file contents into process.env by default
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI; // MONGODB_URI="mongodb+srv://fullstack:password@db.gwcmebp.mongodb.net/?retryWrites=true&w=majority&appName=db"
console.log("connecting to", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
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
